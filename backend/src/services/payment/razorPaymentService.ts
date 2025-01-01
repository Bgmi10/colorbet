import Razorpay from "razorpay";
import { prisma } from "../../../prisma/prisma";


const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string
});

export const createOrder = async (amount: number, currency: string = "INR") => {
       const options = {
          amount: amount,
          currency,
          receipt: `rececipt_${Date.now()}`,
          payment_capture: 1
       }

       try{
          const order = await razorpayInstance.orders.create(options);
          return order;
       }
       catch(e: any){
          console.log(e);
          throw new Error(e);
       }
};

export const updateUserBalance = async (memberId: string, amount: number) => {
       try{
            await prisma.user.update({
            where: { memberId },
            data: {
                balance: {
                    increment: amount
                }
            }
           });
       }
       catch(e: any){
          console.log(e)
          throw new Error(e);
       }
}