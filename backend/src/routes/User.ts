import express from 'express';
import { prisma } from '../prisma/prisma';
import bcypt from 'bcrypt';

const User = express.Router();

User.get("/userprofile", async(req: express.Request, res: express.Response) => {
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
                role: true,
                isSuspended: true,
                loginActivities: {
                    select: {
                        id: true,
                        browser: true,
                        os: true,
                        ip: true,
                        loginTime: true,
                        logoutTime: true,
                        authMethod: true,
                        isp: true,
                        connectionType: true,
                        location: true,
                        deviceModel: true,
                        deviceType: true
                    }
                },
                payments: {
                    select: {
                        id: true,
                        amount: true,
                        upiRef: true,
                        status: true,
                        createdAt: true,
                        senderMobile: true,
                        senderName: true,
                        remarks: true
                    }
                },
                withdrawals: {
                    select: {
                        transactionId: true,
                        id: true,
                        bank: {
                            select: {
                                bankImage: true,
                                bankName: true
                            }
                        },
                        payoutMethod: true,
                        createdAt: true,
                        amount: true,
                        withdrawalFee: true,
                        withdrawalStatus: true,
                        amountToTransfer: true
                    }
                },
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
    
    const { userName, avatarUrl, balance } = req.body;
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
});

User.delete("/delete-account", async(req: express.Request, res: express.Response) => {
    //@ts-ignore
      const { userId } = req.user;

      try{
        await prisma.user.delete({
            where: { id: userId }
        });
        res.cookie('token', '', {
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax' 
        })
        res.status(200).json({ message: "user deleted success" });
      }
      catch(e){
        console.log(e);
        res.status(500).json({ message: "internal server error" });
      }

});

export default User;