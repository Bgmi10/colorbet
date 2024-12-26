import express from "express";
import { smsService } from "../services/smsService";

 const iftttRouter = express.Router();

iftttRouter.post('/ifttt-webhook', (req: express.Request, res: express.Response) => {
    
    const result = smsService(req.body);

    if(result.success){
        res.status(200).json({ message: "sms processed success", utr: result.utrNumber, amount: result.amount });
        return;
    }
    else{
        res.status(400).json({ message: result.message });
    }
})

export default iftttRouter