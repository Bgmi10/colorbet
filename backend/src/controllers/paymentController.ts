    import { createOrder, updateUserBalance } from "../services/paymentservice";
    import express from "express";

    export const initiatePayment = async (req: express.Request, res: express.Response) => {

        const { amount, memberId } = req.body;  

        try{
            const order = await createOrder(amount);
            res.status(200).json({ success: true, order });
        }
        catch(e: any){
            console.log(e);
            res.status(500).json({ success: false, message: e.message });
            throw new Error(e);
        }
    };


    export const handlePaymentSucess = async (req: express.Request, res: express.Response) => {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, memberId, amount} = req.body;

        try{
            const updateUser = await updateUserBalance(memberId, amount);
            res.status(200).json({  success: true, updateUser });
        }
        catch(e: any){
            res.status(500).json({ success: false, message: e.message });
            console.log(e);
        }
    }