import express from "express";
import { withdrawal } from "../utils/zod";
import { prisma } from "../prisma/prisma";
import { generateTransactionId } from "../utils/constants";

const WithdrawalRoute = express.Router();


WithdrawalRoute.post("/withdrawal", async(req: express.Request, res: express.Response) => {
    const isValidReq = withdrawal.safeParse(req.body);
    if(!isValidReq.success){
       res.status(400).json({ message: "invalid request" });
       return;
    }
    const { bankAccountId, amount, payoutMethod, withdrawalFee } = req.body;
    //@ts-ignore
    const { email } = req.user;
    if(!bankAccountId || !amount || !payoutMethod || !withdrawalFee){
       res.status(400).json({ message: "missing body" });
       return;
    }
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
             id: true,
             balance: true
         }
    });

    if(!user){
        res.status(404).json({ message: "user not found" });
        return;
    }

    if(amount > user.balance){
        res.status(400).json({ message: "user balance is not enough." });
        return;
     }

     const amountToTransfer = amount - withdrawalFee;

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
            withdrawalStatus: "PENDING",
            payoutMethod,
            withdrawalFee,
            amountToTransfer
           }
        });
        
       const user1 = await prisma.user.update({
            where: {
                email
            },
            data: {
                balance: {
                    decrement: amount  
                }
            },
            select: {
                balance: true,
                    withdrawals: {
                        select: {
                            id: true,
                            amount: true,
                            amountToTransfer: true,
                            transactionId: true,
                            withdrawalStatus: true,
                            createdAt: true,
                            withdrawalFee: true,
                            payoutMethod: true,
                            bank: {
                                select: {
                                    bankImage: true,
                                    bankName: true
                                }
                            }
                        }
                    }
                } 
           })
        res.status(200).json({ message: "withdrawal requested success", updatedData: user1 });
    }   
    catch(e){
        console.log(e);
        res.status(500).json({ message: "internal server error" });
    }

});

export default WithdrawalRoute;