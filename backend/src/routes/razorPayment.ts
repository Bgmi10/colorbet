import express from "express";
import { initiatePayment, handlePaymentSucess } from "../controllers/razorPayController";

const razorPayment = express.Router();

razorPayment.post("/razorpay", initiatePayment);
razorPayment.post("/razorpay/success", handlePaymentSucess);

export default razorPayment;