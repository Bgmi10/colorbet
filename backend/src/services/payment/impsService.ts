    import Imap from 'imap';
    import { simpleParser } from 'mailparser';
    import * as cheerio from 'cheerio';

    interface EmailSearchConfig {
    fromEmail: string;
    subjectPartial: string;
    referenceNumber: string;
    amount?: string;
    }

    interface EmailVerificationResult {
    senderName: string | null;
    senderMobile: string | null;
    impsRef: string | null;
    remarks: string | null;
    }

    class EmailVerificationService {
    private imap: Imap;

    constructor() {
        this.imap = new Imap({
        user: 'subashchandraboseravi45@gmail.com',
        password: 'yhqm lfla ymbr glun',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
        });
    }

    private async connectToImap(): Promise<void> {
        return new Promise((resolve, reject) => {
        this.imap.once('ready', () => {
            resolve();
        });

        this.imap.once('error', (err: any) => {
            reject(err);
        });

        this.imap.connect();
        });
    }

    private async openMailbox(boxName: string = '[Gmail]/All Mail'): Promise<void> {
        return new Promise((resolve, reject) => {
        this.imap.openBox(boxName, false, (err) => {
            if (err) reject(err);
            else resolve();
        });
        });
    }

    private async searchEmails(criteria: any[]): Promise<number[]> {
        return new Promise((resolve, reject) => {
        this.imap.search(criteria, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
        });
    }

    private async fetchEmail(messageId: number): Promise<any> {
        return new Promise((resolve, reject) => {
        const fetch = this.imap.fetch(messageId, {
            bodies: '',
        });

        fetch.on('message', (msg) => {
            msg.on('body', (stream: any) => {
            simpleParser(stream, (err, parsed) => {
                if (err) reject(err);
                else resolve(parsed);
            });
            });
        });

        fetch.once('error', (err) => {
            reject(err);
        });
        });
    }

    // Extract raw text from HTML content
    private extractTextFromHtml(html: string): string {
        const $ = cheerio.load(html);
        return $('body').text();
    }

    private extractReferenceNumber(text: string): string | null {
        const refMatch = text.match(/IMPS\s*Reference\s*No\s*[:\s]*([\d]+)/i);
        return refMatch ? refMatch[1] : null;
    }

    private extractAmount(text: string): string | null {
        const amountMatch = text.match(/credited by Rs\.\s*([\d,]+\.?\d*)/i);
        return amountMatch ? amountMatch[1].replace(/,/g, '') : null;
    }

    private extractSenderName(text: string): string | null {
        const nameMatch = text.match(/Sender\s*Name\s*[:\s]*([\w\s]+)(?=\s*Sender\s*Mobile)/i);
        return nameMatch ? nameMatch[1].trim() : null;
    }

    private extractSenderMobile(text: string): string | null {
        const mobileMatch = text.match(/Sender\s*Mobile\s*No\s*[:\s]*([\d]+)/i);
        return mobileMatch ? mobileMatch[1] : null;
    }
    private extractRemarks(text: string): string | null {
        const normalizedText = text.replace(/\s+/g, ' ');
        const remarksMatch = normalizedText.match(/Remarks\s*:\s*([\s\S]*?)(?=\s*(IMPORTANT|DISCLAIMER|IMPS\s*Reference\s*No|$))/i);
        if (!remarksMatch) {
            console.log('No match found for remarks');
            return null;
        }

        return remarksMatch[1].trim();
    }
    
    
    

    private normalizeAmount(amount: string | undefined): string {
        if (amount) {
            const normalizedAmount = amount.replace(/,/g, '').replace(/\.00$/, '').trim();
            return normalizedAmount;
        }
        return '';
    }

    public async searchForPaymentEmail(config: EmailSearchConfig): Promise<EmailVerificationResult> {
        try {
          await this.connectToImap();
          await this.openMailbox();
          const date = new Date();
          date.setDate(date.getDate() - 1);
          const past24Hours = date.toISOString().split('T')[0];
          const searchCriteria = [
            ['FROM', config.fromEmail],
            ['SUBJECT', config.subjectPartial],
          ];
          
          const results = await this.searchEmails(searchCriteria);
          
          for (const messageId of results) {
            const email = await this.fetchEmail(messageId);
            const emailHtml = email.html || '';
            const emailText = this.extractTextFromHtml(emailHtml);
            
            const extractedRef = this.extractReferenceNumber(emailText);
            
            if (extractedRef === config.referenceNumber) {
              const senderName = this.extractSenderName(emailText);
              const senderMobile = this.extractSenderMobile(emailText);
              const remarks = this.extractRemarks(emailText);
              
              if (config.amount) {
                const extractedAmount: any = this.extractAmount(emailText);
                const normalizedExtractedAmount = this.normalizeAmount(extractedAmount);
                const normalizedExpectedAmount = this.normalizeAmount(config.amount);
                
                if (normalizedExtractedAmount !== normalizedExpectedAmount) {
                  return {
                    senderName,
                    senderMobile,
                    impsRef: extractedRef,
                    remarks,
                    //@ts-ignore
                    status: 'amount_mismatch',
                    message: `Expected amount ${normalizedExpectedAmount} but found ${normalizedExtractedAmount}`
                  };
                }
              }
              
              return {
                senderName,
                senderMobile,
                impsRef: extractedRef,
                remarks,
                //@ts-ignore
                status: 'success'
              };
            }
          }
          
          return {
            senderName: null,
            senderMobile: null,
            impsRef: null,
            remarks: null,
            //@ts-ignore
            status: 'not_found',
            message: 'No matching transaction found'
          };
          
        } catch (error) {
          console.error('Error in email verification:', error);
          throw error;
        } finally {
          if (this.imap) {
            this.imap.end();
          }
        }
      }
    }

    export default async function searchForEmailRef(
    referenceNumber: string,
    amount?: string
    ): Promise<EmailVerificationResult | false> {
    const emailService = new EmailVerificationService();
    
    try {
        return await emailService.searchForPaymentEmail({
        fromEmail: 'bankalerts@kotak.com',
        subjectPartial: 'Credit of IMPS Transaction',
        referenceNumber: referenceNumber,
        amount: amount
        });
    } catch (error) {
        console.error('Failed to verify payment email:', error);
        throw error;
    }
    }
