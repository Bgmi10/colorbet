import express from "express";
import { prisma } from "../../prisma/prisma";
import searchForEmailRef from "../services/payment/impsService";

const impsRouter = express.Router();
//@ts-ignore
impsRouter.post("/imps", async (req: express.Request, res: express.Response) => {
  const { upiRef, amount } = req.body;
  //@ts-ignore
  const { email } = req.user;

  try {
    // Input validation
    if (!upiRef || upiRef.length !== 12 || !/^\d+$/.test(upiRef)) {
      return res.status(400).json({ message: "Invalid UPI reference number" });
    }

    if (!amount || isNaN(parseFloat(amount))) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Check for existing payment
    const existingPayment = await prisma.payment.findUnique({
      where: { upiRef },
    });

    if (existingPayment) {
      return res.status(400).json({ message: "This payment has already been processed" });
    }

    // Verify email and amount
    const verificationResult = await searchForEmailRef(upiRef, amount);

    if (!verificationResult) {
      return res.status(404).json({ 
        message: "Could not find any transactions with the given UPI reference" 
      });
    }
   //@ts-ignore
    switch (verificationResult.status) {
      case 'amount_mismatch':
        return res.status(400).json({
          message: "Amount mismatch detected",
          //@ts-ignore
          details: verificationResult.message
        });

      case 'not_found':
        return res.status(404).json({
          message: "Transaction not found",
          //@ts-ignore
          details: verificationResult.message
        });

      case 'success':
        if (!verificationResult.senderName || !verificationResult.senderMobile || !verificationResult.impsRef) {
          return res.status(400).json({ 
            message: "Incomplete transaction information" 
          });
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Process payment in transaction
        const payment = await prisma.$transaction(async (p: any) => {
          const pay = await p.payment.create({
            data: {
              upiRef,
              amount: parseInt(amount) * 100,
              status: "COMPLETED",
              senderMobile: verificationResult.senderMobile,
              remarks: verificationResult.remarks,
              senderName: verificationResult.senderName,
              user: {
                connect: { id: user.id },
              },
            },
          });

          await p.user.update({
            where: { email },
            data: {
              balance: {
                increment: Math.round(parseFloat(amount) * 100),
              },
            },
          });

          return pay;
        });

        return res.status(200).json({ 
          message: "Payment verified successfully", 
          payment 
        });

      default:
        return res.status(500).json({ 
          message: "Unknown verification status" 
        });
    }

  } catch (error) {
    console.error("Error in IMPS payment processing:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default impsRouter;