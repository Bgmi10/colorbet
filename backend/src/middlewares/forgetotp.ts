import { prisma } from "../prisma/prisma";
import sendOtp from "../config/awsSes";
import { validEmail } from "../utils/constants";
import  bcrypt  from 'bcrypt';
import { emailSchema } from "../utils/zod";

//@ts-ignore
async function forgetotp (req, res, next){

    const isvalidreq = emailSchema.safeParse(req.body);

    if(!isvalidreq.success){
        res.status(400).json({ message: "Invalid request" });
        return;
    }
    
    const { email } = req.body;

    if(!email){
        return res.status(400).json({ message : "email field is required" });
    }

    if(!validEmail(email)){
        return res.status(401).json({ message : "provide a valid email" });
    }
    
    const user = await prisma.user.findUnique({ where : { email }});
 
    if(!user){
        return res.status(400).json({ message : "User not found try to signin"});
    }

    const generate_otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(generate_otp)
    const hashotp = await bcrypt.hash(generate_otp, 10);
    const expiresAt = new Date(Date.now() +  60 * 1000);

    try { 
        await prisma.otp.upsert({
           where : { email },
           update : {
            email,
            otpHash : hashotp,
            expiresIn : expiresAt,
            createdIn :  new Date()
            },
             create : { 
                email,
                otpHash : hashotp,
                expiresIn : expiresAt

            }
        })

        res.status(200).json({ message : "otp sent sucessfully check your email" });
        sendOtp(email, parseInt(generate_otp), 'forgetpasswordotp')
        next();
        // ideally we should a email to this specific user to perform otp based reset
    }
    catch(e){
        console.log(e);
        return res.status(500).json({ message : "internal server error" });
    }
    

}

export default forgetotp;