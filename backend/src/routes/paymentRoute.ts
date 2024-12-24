import express from "express";
import { initiatePayment, handlePaymentSucess } from "../controllers/paymentController";

const paymentRouter = express.Router();

paymentRouter.post("/payment", initiatePayment);
paymentRouter.post("/payment/success", handlePaymentSucess);

export default paymentRouter;