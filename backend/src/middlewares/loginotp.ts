import express from 'express';
import { prisma } from '../../prisma/prisma';
import bcrypt from 'bcrypt'
import sendOtp from '../config/awsSes';
import { emailSchema } from '../utils/zod';

const loginotp = async (req : express.Request, res : express.Response, next: express.NextFunction) => {

  const isvalidreq = emailSchema.safeParse(req.body);
  if(!isvalidreq.success){
    res.status(400).json({ message: "invalid request" });
    return;
  }
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
      where: { email },
      select: {
        password: true
      }
  });
  if(!user){
      res.status(404).json({ message: "User not found!. try to signin."});
      return;
  }
  if(!user){
    res.status(404).json({ message: "User not found!. try to signin." });
    return;
  }
  const hashpass = await bcrypt.compare(password, user.password);
  if(!hashpass) {
    res.status(401).json({ message: 'invalid credentials' }); 
    return;
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresIn = new Date(Date.now() +  60 * 1000);
  console.log(otp);
  
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
    sendOtp(email,parseInt(otp),'signup');
    next();
  }
  catch(e){
    console.log(e);
  } 
}

export default loginotp