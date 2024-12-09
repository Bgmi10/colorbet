import express from 'express';
import Authmiddleware from '../middlewares/Authmiddleware';
import { emailSchema } from '../utils/zod';
import { prisma } from '../../prisma/prisma';


const User = express.Router();

User.get('/userProfile', Authmiddleware, async(req: express.Request, res: express.Response) => {

    const isvalidreq = emailSchema.safeParse(req.body);
    
    if(!isvalidreq.success){
       res.status(400).json({ message: "Invalid request" });
       return;
    }

    const { email } = req.body;

    if(!email){
        res.status(400).json({ message: "email is required" });
        return;
    }

    try{
        const user = await prisma.user.findUnique({
            where: { email }
        });

        res.status(200).json({ user });
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default User;