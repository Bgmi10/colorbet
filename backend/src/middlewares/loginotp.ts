import express from 'express';
import { prisma } from '../prisma/prisma';
import bcrypt from 'bcrypt'
import sendOtp from '../config/awsSes';
import { emailSchema } from '../utils/zod';
import { handleResponse } from '../utils/helper';

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
        password: true,
        isSuspended: true,
        suspensionEndTime: true
      }
  });
  if(!user){
      res.status(404).json({ message: "User not found!. try to signin."});
      return;
  }
  
  const hashpass = await bcrypt.compare(password, user.password);
  if(!hashpass) {
    res.status(401).json({ message: 'invalid credentials' }); 
    return;
  }

  if(user.isSuspended){
    const currentTime = new Date();
    
    if(user.suspensionEndTime && user.suspensionEndTime > currentTime){
      handleResponse(
        res,
        400,
        `Your account is suspended. You will be able to log in after ${user.suspensionEndTime.toLocaleString()}. 
         If you believe this is a mistake or need access to your account sooner, please contact support and provide a valid reason.`
      );      
      return;
    }
    else{
      await prisma.user.update({ 
        where: { email },
        data: {
          suspensionEndTime: null,
          isSuspended: false,
          suspensionTime: null
        }
      })
    }
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