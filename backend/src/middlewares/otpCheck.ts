import { prisma } from "../../prisma/prisma";
import { validEmail } from "../utils/constants";
import  bcrypt  from 'bcrypt';

//@ts-ignore
async function otpCheck (req, res, next){

    const {email} = req.body;

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

    // here store the otp in db for tempropry and delete it after verifed

    const hashotp = await bcrypt.hash(generate_otp , 10);
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
        console.log(generate_otp);
        next();
        // ideally we should a email to this specific user to perform otp based reset
    }
    catch(e){
        console.log(e);
        return res.status(500).json({ message : "internal server error" });
    }
    

}

export default otpCheck;