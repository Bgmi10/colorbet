import express from 'express';
import { prisma } from '../../prisma/prisma';


const User = express.Router();

User.get('/userprofile', async(req: express.Request, res: express.Response) => {
     //@ts-ignore
    const { email } = req.user;
    try{
        const user = await prisma.user.findUnique({
            where: { email }
        });

        res.status(200).json({ id: user?.id, email: user?.email, userName: user?.userName, balance: user?.balance, memberId: user?.memberId});
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "Internal server error" });
    }
});


User.put("/userprofile", async(req: express.Request, res: express.Response) => {
    const { userName } = req.body;
    //@ts-ignore
    const { email } = req.user;

    if(!userName){
        res.status(400).json({ message: "missing body" });
        return;
    }

    try{
        const user = await prisma.user.update({
            where: { email },
            data: {
                userName: userName
            },
            select: {
                userName: true
            }
        });

        res.status(200).json({ message: "username updated", userName: user?.userName });
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "internal server error" });
    }
})

export default User;