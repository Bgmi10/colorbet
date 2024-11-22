import { prisma } from "../../prisma/prisma";
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import  bcrypt  from 'bcrypt';

const express = require('express');


const AuthRouter = express.Router();

//@ts-ignore

AuthRouter.post('/signin' ,  async(req , res ) => {

    const { email, password, name, phonenumber } = req.body;
 
    if(!email || !password  || !phonenumber ) {

        return res.status(400).json({message : "bad request all fields are required"})
    
    }

    if(!name){
    
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
        const unknownUserName = generateRandomUsername(randomUsernameLength);
        
    }
        
    const hashedpassword = await bcrypt.hash("password" , 10).then(res => res); 

    try {

        await prisma.user.create({
            //@ts-ignore
            data : {
                  username : name,
                  phonenumber : phonenumber,
                  password : hashedpassword,
                  email : email
            }
        })

        const token = jwt.sign({name : name} , process.env.JWT_SECRET)

        res.status(200).json({
            message : 'user created sucessfully',
            token
        })
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
    
    const hashpass =  await bcrypt.hash(password , 10).then(res => res);

    try {
       const user =  await prisma.user.findUnique({
            where : {email}
        })

        if(user?.password !== hashpass) {
            return res.status(401).json({message : 'invalid credentials'}) 
        }
        const token = jwt.verify();
        res.status(200).json({message : 'user verfied' , token : })

    }
})

module.exports = AuthRouter;

