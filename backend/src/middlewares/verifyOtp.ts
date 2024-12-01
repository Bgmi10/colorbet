import { prisma } from "../../prisma/prisma";
import bcrypt from 'bcrypt';

//@ts-ignore
async function verifyOtp (req, res, next) {

    const { otp , email } = req.body;

    if(!otp || !email){
        return res.status(400).json({ message : "otp and email is required field"});
    }
 
    try {
        const user = await prisma.otp.findUnique({
            where : { email }
        });

        if(!user){
             res.status(404).json({ message : "OTP not found or has expired"});
             return;
        }
      
        if (new Date() > user.expiresIn) {
            res.status(400).json({ message: "OTP has expired" });
            return;
          }

        const compareotp = await bcrypt.compare(otp , user?.otpHash);
      
        if(!compareotp){
            res.status(401).json({ message : "Invalid Otp" });
            return;
        }

        next();

    }
    catch(e){
       // console.log(e);
        res.status(500).json({ message : "internal server error" })
    }
    

}

export default verifyOtp;