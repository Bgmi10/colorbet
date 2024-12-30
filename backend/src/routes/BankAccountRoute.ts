import express from "express";
import { addBankAccount, withdrawal } from "../utils/zod";
import { prisma } from "../../prisma/prisma";
import { generateTransactionId } from "../utils/constants";

const BankAccountRoute = express.Router(); 

BankAccountRoute.post("/add-bankaccount", async (req: express.Request, res: express.Response) => {
    const isValidReq = addBankAccount.safeParse(req.body);
    
    if(!isValidReq.success){
        res.status(400).json({ message: "invalid request" });
        return;
    }
    //@ts-ignore
    const { email } = req.user;
    const { accountHolderName, accountNumber, ifscCode, upiId, bankName, bankImage } = req.body;

    if(!accountHolderName || !accountNumber || !ifscCode || !bankName){
        res.status(400).json({ message: "missing body" });
        return;
    };


    const bankAccount = await prisma.bankAccount.findUnique({
        where: { accountNumber }
    });

    if(bankAccount){
        res.status(400).json({ message: "Bank Account Already exist" });
        return;
    }

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true}
    });
    
    try{
        const response =  await prisma.bankAccount.create({
          data: {
            email,
            accountHolderName,
            accountNumber,
            upiId,
            bankName,
            bankImage,
            ifscCode,
            createdAt: new Date(),
            user: {
                connect: { id: user?.id }
            },
            accountStatus: {
                create: [{ verified: false, reason: '' }]
            }
          }
         });

         res.status(200).json({ message: "Bank account created", bankAccount: response });
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

    try{
        await prisma.withdrawal.create({
           data: {
            amount,
            user: {
                connect: { id: user?.id}
            },
            bank: {
                connect: { id: bankAccountId }
            },
            transactionId: generateTransactionId(),
            withdrawalStatus: "PENDING" 
           }
        });
        res.status(200).json({ message: "withdrawal requested success" });
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "internal server error" });
    }

});


BankAccountRoute.delete("/add-bankaccount/:id", async (req: express.Request, res: express.Response) => {
    const { id } = req.params;

    if(!id || id === undefined){
        res.status(400).json({ message: "missing id" });
        return;
    }

    try{
        const response = await prisma.bankAccount.delete({
            where: { id: parseInt(id) },
            include: { accountStatus: true }
        });
        res.status(200).json({ message: "Bank Account Deleted success", restData: response});
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "internal server error" });
    }
});

BankAccountRoute.put("/edit-bankaccount/:id", async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { bankName, accountHolderName, accountNumber, ifscCode, upiId, bankImage } = req.body;

    if(!id || id === undefined){
        res.status(400).json({ message: "missing id" });
        return;
    }
    if(!bankName || !accountHolderName || !accountNumber || !ifscCode){
        res.status(400).json({ message: "missing body" });
        return;
    }
     
    try{

        const p = await prisma.accountStatus.findFirst({
            where: { bankAccountId: parseInt(id) }
        })
        const response = await prisma.bankAccount.update({
            where: { id: parseInt(id) },
            data: {
               bankName,
               accountHolderName,
               accountNumber,
               upiId,
               ifscCode,
               bankImage,
               accountStatus: {
                 update: {
                    where: {
                        id: p?.id,
                    },
                    data: {
                        verified: false
                    }
                 }
               }
            }
        });
        res.status(200).json({ message: "Bank Account Updated", updatedBankData: response });
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "internal server error" })
    }
})

export default BankAccountRoute;