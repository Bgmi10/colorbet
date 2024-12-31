import express from 'express';
import { prisma } from '../../prisma/prisma';
import bcypt from 'bcrypt';

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
                memberId: true,
                payments: true,
                withdrawals: true,
                bankAccounts: {
                    select: {
                        id: true,
                        accountNumber: true,
                        accountHolderName: true,
                        bankName: true,
                        ifscCode: true,
                        upiId: true,
                        createdAt: true,
                        updatedAt: true,
                        bankImage: true,
                        accountStatus: { 
                          select: {
                            verified: true,
                            createdAt: true
                        }
                    }
                }
            }
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
});

User.post("/checkpassword", async(req: express.Request, res: express.Response) => {
    const { password } = req.query;
       //@ts-ignore
    const { email } = req.user

    if(!password){
        res.status(400).json({ message: "missing params" });
        return;
    }
    try{
        const user = await prisma.user.findUnique({ 
            where: { email },
         });

         if(!user){
            res.status(404).json({ message: "not found user" });
            return;
         }

         const checkPassword = await bcypt.compare(String(password), user.password);

         if(!checkPassword){
            res.status(400).json({ message: "password not matched" });
         }
         res.status(200).json({ message: "password matched" });
    }
    catch(e){
        console.log(e);
    }
})

export default User;