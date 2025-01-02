import { prisma } from "../../prisma/prisma";
import jwt from 'jsonwebtoken';
import  bcrypt  from 'bcrypt';
import express from 'express';
import { validEmail } from "../utils/constants";
import Signinotp from "../middlewares/Signinotp";
import verifysigninotp from "../middlewares/verifysigninotp";
import { signinSchema, loginSchema, forget_passoword_schema, changePassword } from "../utils/zod";
import forgetotp from "../middlewares/forgetotp";
import verifyforgetotp from "../middlewares/verifyforgetotp";
import Authmiddleware from "../middlewares/Authmiddleware";
import LoginActivity from "../middlewares/LoginActivity";

const AuthRouter = express.Router();
const isProd = false;

AuthRouter.post('/generate-signin-otp', Signinotp, (req : express.Request, res: express.Response, next : express.NextFunction) => {

    res.status(200).json({ message : "otp sent to your email. please verify it" });
    
});

AuthRouter.post('/signin', verifysigninotp, async (req: express.Request, res: express.Response) => {

    const validation = signinSchema.safeParse(req.body);

    if(!validation.success){
        res.status(400).json({ message : "invalid request" });
        return;
    }

    const { email, password, name } = req.body;
 
    if(!email || !password) {
      res.status(400).json({ message: "bad request all fields are required" });
      return;
    }

    if(!validEmail(email)){
        res.status(401).json({ message: 'email format error' });
        return;
    }

    const upperCaseLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); 
    const lowerCaseLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)); 
    const digits = Array.from({ length: 9 }, (_, i) => (i + 1).toString()); 
    const fullList = [...upperCaseLetters, ...lowerCaseLetters, ...digits];
    
    function generateRandomUsername(length : any) {
        let username = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * fullList.length);
            username += fullList[randomIndex];
         }
       return username;
   }

       const randomUsernameLength = Math.floor(Math.random() * 5) + 8; 
       const memberId = generateRandomUsername(randomUsernameLength); 
       const hashedpassword = await bcrypt.hash(password, 10);

    try {
       const { browser, location, connectionType, deviceType, ip, isp, os } = await LoginActivity(req);

       const user = await prisma.user.create({
            data: {
              userName: name,
              memberId,
              password: hashedpassword,
              email,
              balance: 0.00,
              avatarUrl: ""
            },
        });

        await prisma.otp.delete({
            where: { email }
        });
        const token = jwt.sign({ email: email, userId: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '10h'
        });

        await prisma.loginActivity.create({
            data: {
                userId: user?.id,
                browser,
                location,
                connectionType,
                deviceType,
                ip,
                isp,
                os,
                sessionToken: token,
                loginStatus: 'true'
            }
        });
    
        res.cookie('token', token, { expires: new Date(Date.now() + 10 * 60 * 60 * 1000), httpOnly: false,  sameSite: process.env.NODE_ENV === 'production' ? "strict" : "lax",
        secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({ message: "Signed up sucessfully"});
    }
    catch(e){
        console.log(e);
    }
});

AuthRouter.post('/login' , async (req: express.Request, res: express.Response) => {

    const isvalidreq = loginSchema.safeParse(req.body);

    if(!isvalidreq.success){
        res.status(400).json({ message: "invalid request" });
        return;
    }

    const { email, password } = req.body;
    const { browser, location, connectionType, deviceType, ip, isp, os } = await LoginActivity(req);

    if(!email || !password){
         res.status(400).json({
            message : 'invaild request'
        });
        return;
    }
    
    if(!validEmail(email)){
       res.status(401).json({ message : 'email format error' });
       return;
    }

    try {
        
       const user =  await prisma.user.findUnique({
            where: { email }
        });

        if(!user){
          res.status(404).json({ message: "User not found!" });
          return;
        }

        const hashpass = await bcrypt.compare(password, user.password);

        if(!hashpass) {
          res.status(401).json({ message: 'invalid credentials' }); 
          return;
        }
        
        const token = jwt.sign({ email: email, userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '10h' });
        
        await prisma.loginActivity.create({
            data: {
                userId: user?.id,
                browser,
                location,
                connectionType,
                deviceType,
                ip,
                isp,
                os,
                sessionToken: token,
                loginStatus: 'true'
            }
        });

        res.cookie('token', token, { expires: new Date(Date.now() + 10 * 60 * 60 * 1000), httpOnly: false, sameSite: process.env.NODE_ENV === 'production' ? "strict" : "lax",
        secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({ message: "logged In successfully"});
    }
    catch(e){
        console.log(e);
    }
});


AuthRouter.post('/logout', Authmiddleware, (req : express.Request, res : express.Response) => {
      //@ts-ignore
      const { token } = req.user;
      
     res.cookie('token', '', { expires : new Date(0), path: '/', httpOnly: false, sameSite: process.env.NODE_ENV === 'production' ? "strict" : "lax",
     secure: process.env.NODE_ENV === 'production'});
     res.status(200).json({ message : 'logged out successfully' });
     

});


AuthRouter.post('/generate-forget-otp', forgetotp, (req: express.Request, res: express.Response) => {
     
     res.status(200).json({ message: "otp sent" });

});

//@ts-ignore
AuthRouter.post('/forgetpassword', verifyforgetotp, async (req: express.Request, res: express.Response) => {

    const isvalidreq = forget_passoword_schema.safeParse(req.body);

    if(!isvalidreq.success){
        res.status(400).json({ message: "Invalid request" });
        return;
    }

    const { email, newpassword } = req.body;

    try {
       
        const hashnewpassword = await bcrypt.hash(newpassword, 10);

         await prisma.user.update({
            where: {
               email 
            },
            data: {
               password: hashnewpassword
            }
        }); 
        
        await prisma.otp.delete({ where: { email } });

        res.status(200).json({ message: "password changed sucessfully" });
    }
    catch(e){
        console.log(e);
    }
});


AuthRouter.post("/change-password", Authmiddleware, async (req: express.Request, res: express.Response) => {

    const isvalid = changePassword.safeParse(req.body);

    if(!isvalid.success){
        res.status(400).json({ message: "invalid request" });
        return;
    }
    const { oldPassword, newPassword } = req.body;
    //@ts-ignore
    const { email } = req.user;

    if(!oldPassword || !newPassword){
        res.status(400).json({ message: "missing body" });
        return;
    }

    try{
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if(!user){
            res.status(404).json({ message: "not found" });
            return;
        }

        const isValidPassword = await bcrypt.compare(oldPassword, user?.password);

        if(!isValidPassword){
            res.status(400).json({ message: "old password not matched" });
            return ;
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: {
                password: encryptedPassword
            }
        });
        res.status(200).json({ message: "password changed success" })
    }
    catch(e){
        console.log(e);
    } 
});

export default AuthRouter;

