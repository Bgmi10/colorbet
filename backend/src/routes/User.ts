import express from 'express';
import { prisma } from '../../prisma/prisma';


const User = express.Router();

User.get('/userprofile', async(req: express.Request, res: express.Response) => {
     //@ts-ignore
    const { email } = req.user;
    try{
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                email: true,
                avatarUrl: true,
                balance: true,
                userName: true,
                memberId: true
            }
        });

        res.status(200).json({ user });
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "Internal server error" });
    }
});


User.put("/userprofile", async(req: express.Request, res: express.Response) => {
    const { userName, avatarUrl } = req.body;
    //@ts-ignore
    const { email } = req.user;

    try{
        const user = await prisma.user.update({
            where: { email },
            data: {
                userName: userName,
                avatarUrl
            },
            select: {
                userName: true,
                avatarUrl: true
            }
        });

        res.status(200).json({ message: "userProfile updated", user });
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "internal server error" });
    }
})

export default User;