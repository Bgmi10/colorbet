import express from 'express';
import { prisma } from '../../prisma/prisma';
import bcrypt from 'bcrypt'

const Signinotp = async (req : express.Request, res: express.Response, next: express.NextFunction) => {

    const { email } = req.body;
    const otp = Math.floor(Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresIn = new Date(Date.now() +  60 * 1000);
    console.log(otp)
      try{ 
        await prisma.otp.upsert({
             where : { email },
             update : {
                otpHash : otpHash,
                email,
                createdIn : new Date(),
                expiresIn 
             },
             create : {
                otpHash : otpHash,
                email,
                createdIn : new Date(),
                expiresIn
             }
        })

        next();
        // ideally here we should make a email call and send the otp to email
      }
      catch(e){
        console.log(e);
      }
      
}

export default Signinotp