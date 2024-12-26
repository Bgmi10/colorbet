import express from "express";
import { prisma } from "../../prisma/prisma";
import searchForEmailRef from "../services/payment/impsService";


const impsRouter = express.Router();

impsRouter.post("/imps", async (req: express.Request, res: express.Response) => {

 const { upiRef } = req.body;
 //@ts-ignore
 const { email } = req.user;

 try{
    
    // if(!upiRef || upiRef.length !== 12 || !/^\d+$/.test(upiRef)) {
    //     res.status(400).json({ message: 'Invalid UPI reference number' });
    //     return;
    // };

    // const existingPayment = await prisma.payment.findUnique({
    //     where: { upiRef }
    // });

    // if(existingPayment){
    //     res.status(400).json({ message: "This payment already been processed" });
    //     return;
    // }

    const isValid = await searchForEmailRef(upiRef);

    if(!isValid){
        res.status(404).json({ message: "couldn`t able to find any transactions with given upi reference try another one or contact support" });
    };
     //@ts-ignore
    const payment = await prisma.payment.$transaction(async (p: any) => {
        const pay = await p.payment.create({
            data: {
                upiRef,
                email,
                status: "COMPLETED"
            }
        })

        await p.user.findUnique({
            where: { email },
            data: {
                balance: {
                    increment: pay.amount 
                }
            }
        });

        return payment;
    });
     
    res.status(200).json({ message: "payment verified success", payment });
 }
 catch(e){
    console.log(e);
    res.status(500).json({ message: "Internal server error" })
 }

})

export default impsRouter;