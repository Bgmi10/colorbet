import { prisma } from "../../prisma/prisma";
import jwt from 'jsonwebtoken';
import  bcrypt  from 'bcrypt';
import express from 'express';
import { validEmail } from "../utils/constants";
import Signinotp from "../middlewares/Signinotp";
import verifysigninotp from "../middlewares/verifysigninotp";
import { userSchema } from "../utils/zod";
import forgetotp from "../middlewares/forgetotp";
import verifyforgetotp from "../middlewares/verifyforgetotp";

const AuthRouter = express.Router();

AuthRouter.post('/generate-signin-otp', Signinotp, (req : express.Request, res: express.Response, next : express.NextFunction) => {

    res.status(200).json({ message : "otp sent to your email. please verify it" });
    
});

AuthRouter.post('/signin', verifysigninotp, async (req: express.Request, res: express.Response) => {

    const validation = userSchema.safeParse(req.body);

    if(!validation){
        res.status(400).json({ message : "invalid request" });
        return;
    }

    const { email, password, name } = req.body;
 
    if(!email || !password || !name) {
      res.status(400).json({ message : "bad request all fields are required" });
      return;
    }

    if(!validEmail(email)){
        res.status(401).json({ message : 'email format error' });
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
        
    const hashedpassword = await bcrypt.hash("password",10).then(res => res); 

    const user  = await prisma.user.findUnique({
        where : { email }
    })

    if(user?.email === email){
       res.status(401).json({ message: 'user with this email is already exist try to login' });
       return;
    }


    try {
        await prisma.user.create({
            data : {
                  username : name,
                  memberId,
                  password : hashedpassword,
                  email
            }
        })
    
        const token = jwt.sign({ name: name } , process.env.JWT_SECRET as string, {
            expiresIn : '10h'
        });
    
        res.cookie('token', { token });
        res.status(200).json({ message: "user created sucessfully", User: user, token: token })
   
       
    }
    catch(e){
        console.log(e);
    }

    
})


AuthRouter.post('/login' , async (req: express.Request, res: express.Response) => {

    const { email, password } = req.body;

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
            where : { email }
        });

        if(!user){
          res.status(404).json({ message : "User not found!" });
          return;
        }

        const hashpass = await bcrypt.compare(password, user?.password);

        if(!hashpass) {
          res.status(401).json({ message : 'invalid credentials' }); 
          return;
        }
        
        const token = jwt.sign({ name: user?.username }, process.env.JWT_SECRET as string, { expiresIn: '4h' });
        res.cookie('token', {token});
        res.status(200).json({ message: "user authenticated", user: user, token: token });
    }
    catch(e){
        console.log(e);
    }
});


AuthRouter.post('/logout', (req : express.Request, res : express.Response) => {

     res.cookie('token', '', { expires : new Date(0) });
     res.status(200).json({ message : 'logout success' });

});


AuthRouter.post('/generate-forget-otp', forgetotp, (req: express.Request, res: express.Response) => {

     res.status(200).json({ message : "otp sent" });

})


AuthRouter.post('/forgetpassword', verifyforgetotp, async (req: express.Request, res: express.Response) => {
    const { email , newpassword } = req.body;

    try {
       
        const hashnewpassword = await bcrypt.hash(newpassword , 10);

         await prisma.user.update({
            where : {
               email 
            },
            data : {
               password : hashnewpassword
            }
        });

        res.status(200).json({ message : "password changed sucessfully" });

        await prisma.otp.delete({ where : { email } });
    }
    catch(e){
        console.log(e);
    }
})
export default AuthRouter;

