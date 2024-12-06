import AWS  from 'aws-sdk';

const ses = new AWS.SES({ 
    region: 'eu-north-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export default async function sendOtp(email : string, otp: number, endpoint: string){
  
    const params = {
        Source: 'subashchandraboseravi45@gmail.com',
        Destination: { 
            ToAddresses: [email]
        },
        Message: {
            Subject: {
                Data: `Your otp to ${endpoint}`
            },
            Body: {
                Text: {
                    Data: `Your code is ${otp}`
                }
            }
        }

    }
    
  try{
    //@ts-ignore
    await ses.sendEmail(params).promise();
    console.log('email sent successfully');
  }
  catch(e){
    console.log(e);
    console.log('error while sending email in SES')
  }
};
