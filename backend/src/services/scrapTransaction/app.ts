import puppeteer from "puppeteer";
import fs from "fs";
import axios from "axios";
import readline from "readline";
import { Jimp } from "jimp";
import path from "path";
import Aws, { Textract } from "aws-sdk";

Aws.config.update({
  region: "eu-north-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string ,
  secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY as string
})

console.log(process.env.AWS_ACCESS_KEY_ID)

const textRact = new Aws.Textract();

async function scrapTransactions() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://netbanking.kotak.com/knb2/", { waitUntil: "networkidle2" });

  // Extract the captcha image from the src attribute
  await page.type("#userName", "689511358");
  setTimeout( async () => {
    await page.type("#credentialInputField", "Pubg@001Bgmi@001");
  }, 200);
  
  // setTimeout( async () => {
  //   const captchaBase64 = await page.evaluate(() => {
  //       const captchaImage = document.querySelector("img.ng-star-inserted"); // Use appropriate selector for captcha image
  //       if (captchaImage) {
  //           //@ts-ignore
  //         return captchaImage.getAttribute("src").split(",")[1]; // Extract base64 part
  //       }
  //       return null;
  //     });

  //     if (captchaBase64) {
        
  //        async function preProcessCaptcha (captchaBase64: any){
  //          const image = await Jimp.read(Buffer.from(captchaBase64, 'base64'));
  //          //@ts-ignore
  //          image.greyscale().contrast(1).threshold({ max: 18 }).normalize()

  //          let count = Math.floor(Math.random() * 1000);
  //          const fileName = `processedImage${count}.png`;
           
  //          const filePath: any = path.join(__dirname, 'processedImages', fileName);
           
  //          if (!fs.existsSync(path.dirname(filePath))) {
  //           fs.mkdirSync(path.dirname(filePath), { recursive: true });
  //          }
           
  //          await image.write(filePath);

  //          return filePath
  //        }
  //        preProcessCaptcha(captchaBase64).then((res: any) => {
  //         byPassCaptcha(res);
  //        }) 
  //     } else {
  //       console.log("Captcha image not found.");
  //     }

       
  // }, 2000);
   

  setTimeout(async () => {
    await page.click(".btn.btn-primary.float-right.marb16.btnVertualsubmit.mt-3");
  }, 500);

  await page.waitForSelector('#otpMobile');
  const otp: any = await handleOtp();
  
  await page.type("#otpMobile", otp);

  setTimeout(async () => {
    await page.click(".btn.btn-primary.float-right.btn-mar-right.ng-star-inserted");
  }, 500);

  await page.waitForSelector("#searchInputBox");

  await page.type("#searchInputBox", "statements");
  const button = await page.waitForSelector(".ng-star-inserted");
  if(button){
    button.click()
  }
  setTimeout(async () => {
    await page.click(".ng-star-inserted");    
  }, 1000);

  
  // const transaction = await page.evaluate(() => {
  //   const rows = document.querySelectorAll(".Recent Transactions tr");
  //   return Array.from(rows, row => {
  //     const col = row.querySelectorAll("td");
  //     return {
  //       chq: col[1].innerText,
  //       Description: col[0].innerText,
  //       Amount: col[2].innerText
  //     };
  //   });
  // });

  // console.log(transaction);
}

scrapTransactions().catch(e => console.log(e)); 

 
async function convertImageToBase64 (imagePath: any){
  const res = fs.readFileSync(imagePath);
  return res.toString('base64');
}

async function byPassCaptcha(base64Captcha: string) { 
    const a = await convertImageToBase64(base64Captcha);
    
     try{
      const params = {
        Document: {
          Bytes: a
        }
      }
      const textExtract = await textRact.detectDocumentText(params).promise();

      if(textExtract.Blocks){
        let extract = '';

        textExtract.Blocks.forEach(i => {
          if(i.BlockType === "LINE"){
            extract += i.Text + `\n`;
          }
        })
        console.log(extract)

      }
      else {
        console.log('No text found in the captcha.');
      }
     }
      catch(e){
        console.log(e);
     }
}

async function handleOtp() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question("Enter OTP: ", (otp) => {
      rl.close();
      resolve(otp);
    });
  });
}
