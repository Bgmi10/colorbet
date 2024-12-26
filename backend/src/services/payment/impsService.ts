import nodemailer from "nodemailer";

// after test dont forget to place the creaditals in to .env 
const transporter  = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "subashchandraboseravi45@gmail.com",
        pass: "Pubg@001Bgmi@001"
    }
})


export default function searchForEmailRef (upiRef: any){
   return new Promise((resolve, reject) => {
        const searchCriteria = {
            from: "bankalerts@kotak.com",
            subject: "We wish to inform you that your account xx0713 is credited by",
            search: upiRef,
            recent: false
        };
         //@ts-ignore
        transporter.search(searchCriteria, (err: any, results: any) => {
          if(err){
              reject(err);
              console.log(err);
          }

          resolve(results.lenght > 0);
        })
   })
}