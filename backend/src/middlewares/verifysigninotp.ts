import express from 'express';
import { prisma } from '../prisma/prisma';
import bcrypt from 'bcrypt'
import { email_and_otp_schema } from '../utils/zod';

const verifysigninotp = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
    
    const isvalidreq = email_and_otp_schema.safeParse(req.body);

    if(!isvalidreq.success){
      res.status(400).json({ message: "Invalid request" });
      return;
    }
    
    const { otp, email } = req.body;
    
    if( !email) {
        res.status(400).json({ message : "email is required"});
        return;
    }
    if(!otp) {
        res.status(400).json({ message : "otp is required"});
        return;
    }

    try {
        const user = await prisma.otp.findUnique({
            where : {
                email
            }
        });

        if(!user){
           res.status(404).json({ message: "resend the otp" });
           return;
        }

        if(user?.expiresIn < new Date()){
            const expiresIn = new Date(user?.expiresIn).getTime();
            const currentTime = new Date().getTime();

            if(!isNaN(expiresIn)){
                const expires = Math.floor((currentTime - expiresIn) / 1000);

              const formatTime = (seconds: number) => {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
              };

             const expiresin =  formatTime(expires);
             res.status(401).json({ message: `otp expired ${expiresin}` });
            }
    
            await prisma.otp.delete({
                where : {email}
            })
            return; 
        }

        const hashedotp = await bcrypt.compare(otp, user?.otpHash);

        if(!hashedotp){
            res.status(401).json({ message: "Incorrect otp" });
            return;
        }

        next();
    }
    catch(e){
        console.log(e);
    }
}

export default verifysigninotp