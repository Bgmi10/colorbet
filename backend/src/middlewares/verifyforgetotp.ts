import { prisma } from "../prisma/prisma";
import bcrypt from 'bcrypt';
import { email_and_otp_schema } from "../utils/zod";
import express from 'express';

async function verifyforgetotp (req: express.Request, res: express.Response, next: express.NextFunction) {

    const isvalidreq = email_and_otp_schema.safeParse(req.body);

    if(!isvalidreq.success){
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    const { otp, email } = req.body;

    if(!otp || !email){
        return res.status(400).json({ message: "otp and email is required field"});
    }
 
    try {
        const user = await prisma.otp.findUnique({
            where: { email }
        });

        if(!user){
             res.status(404).json({ message: "OTP not found or has expired"});
             return;
        }
      
        const currentTime = new Date().getTime();
        const expriesin = new Date(user.expiresIn).getTime();

        if (currentTime > expriesin) {
            await prisma.otp.delete({
                where: { email }
            })
            res.status(400).json({ message: "OTP has expired" });
            return;
          }

        const compareotp = await bcrypt.compare(otp , user?.otpHash);
      
        if(!compareotp){
            res.status(401).json({ message: "Invalid Otp" });
            return;
        }

        next();

    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "internal server error" });
    }
    

}

export default verifyforgetotp;