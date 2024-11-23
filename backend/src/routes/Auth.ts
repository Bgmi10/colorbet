import { prisma } from "../../prisma/prisma";
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import  bcrypt  from 'bcrypt';
import express from 'express';


const AuthRouter = express.Router();

//@ts-ignore

AuthRouter.post('/signin' ,  async (req , res ) => {

    const { email, password, name } = req.body;
 
    if(!email || !password || !name ) {

        return res.status(400).json({message : "bad request all fields are required"})
        
    }

    const upperCaseLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); 
    const lowerCaseLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)); 
    const digits = Array.from({ length: 9 }, (_, i) => (i + 1).toString()); // 1-9
    const fullList = [...upperCaseLetters, ...lowerCaseLetters, ...digits];
    
   

    function generateRandomUsername(length : any) {
        let username = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * fullList.length);
            username += fullList[randomIndex];
         }
       return username;
   }

       const randomUsernameLength = Math.floor(Math.random() * 5) + 8; // Length between 8 and 12
       const memberId = generateRandomUsername(randomUsernameLength);
        
    const hashedpassword = await bcrypt.hash("password",10).then(res => res); 
    //@ts-ignore
    const user  = await prisma.user.findUnique({
        where : {email}
    })

    if(user?.email === email){
        return res.status(401).json({message : 'user with this email is already exist try to login'})
    }


    try {
       
        await prisma.user.create({
            //@ts-ignore
            data : {
                  username : name,
                  memberId,
                  password : hashedpassword,
                  email
            }
        })
        //@ts-ignore
        const token = jwt.sign({name : name} , process.env.JWT_SECRET , {
            expiresIn : '10h'
        });
        //@ts-ignore
        res.cookie('token' , { token});
        res.status(200).json({message : "user created sucessfully"})
   
       
    }
    catch(e){
        console.log(e);
    }

    
})

//@ts-ignore
AuthRouter.post('/login' , async (req , res) => {

    const {email , password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            message : 'invaild request'
        })
    }
    

    try {
       const user =  await prisma.user.findUnique({
            where : {email}
        });

        if(!user){
            return res.status(404).json({ message : "invalid credentials" })
        }
        //@ts-ignore  
        const hashpass = await bcrypt.compare(password , user?.password);

        if(!hashpass) {
            return res.status(401).json({message : 'invalid credentials'}); 
        }
        //@ts-ignore
        const token = jwt.sign({name : user?.username} , process.env.JWT_SECRET ,  { expiresIn : '4h' });
        res.cookie('token' ,{token});
        res.status(200).json({ message : 'user verfied' });
        //@ts-ignore
     

    }
    catch(e){
        console.log(e);
    }
});

//@ts-ignore

AuthRouter.post('/logout' , (req, res) => {
    //@ts-ignore
     res.cookie('token' , '' ,{ expires : new Date(0)} );
     return res.status(200).json({message : 'logout success'});

});

export default AuthRouter;

