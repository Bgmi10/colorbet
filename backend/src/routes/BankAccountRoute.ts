import express from "express";
import { addBankAccount, withdrawal } from "../utils/zod";
import { prisma } from "../../prisma/prisma";

const BankAccountRoute = express.Router(); 

BankAccountRoute.post("/add-bankaccount", async (req: express.Request, res: express.Response) => {
    const isValidReq = addBankAccount.safeParse(req.body);
    
    if(!isValidReq.success){
        res.status(400).json({ message: "invalid request" });
        return;
    }
    //@ts-ignore
    const { email } = req.user;
    const { accountHolderName, accountNumber, ifscCode, upiId, bankName } = req.body;

    if(!accountHolderName || !accountNumber || !ifscCode || !bankName){
        res.status(400).json({ message: "missing body" });
        return;
    }
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true}
    });
    
    try{
         await prisma.bankAccount.create({
          data: {
            email,
            accountHolderName,
            accountNumber,
            upiId,
            bankName,
            ifscCode,
            createdAt: new Date(),
            user: {
                connect: { id: user?.id }
            }
          }
         });

         res.status(200).json({ message: "Bank account created" });
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "internal server error" });
    }
});


BankAccountRoute.post("/withdrawal", async(req: express.Request, res: express.Response) => {
    const isValidReq = withdrawal.safeParse(req.body);
    if(!isValidReq.success){
       res.status(400).json({ message: "invalid request" });
       return;
    }
    const { bankAccountId, amount } = req.body;
    //@ts-ignore
    const { email } = req.user;
    if(!bankAccountId || !amount){
       res.status(400).json({ message: "missing body" });
       return;
    }
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true }
    });

    const transactionId = () => {
        const now = Date.now();
        const randomsuffix = Math.random().toString(36).substring(2, 10);
        return `txn_${now}_${randomsuffix}`;
    } 
    try{
        await prisma.withdrawal.create({
            //@ts-ignore
           data: {
            amount,
            user: {
                connect: { id: user?.id}
            },
            bank: {
                connect: { id: bankAccountId }
            },
            transactionId: transactionId(),
            withdrawalStatus: "PENDING" 
           }
        });
        res.status(200).json({ message: "withdrawal requested success" });
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "internal server error" });
    }

})


export default BankAccountRoute;