import express from 'express';
import Authmiddleware from '../middlewares/Authmiddleware';
import { prisma } from '../../prisma/prisma';


const User = express.Router();

User.get('/userprofile', Authmiddleware, async(req: express.Request, res: express.Response) => {
     //@ts-ignore
    const { email } = req.user;
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