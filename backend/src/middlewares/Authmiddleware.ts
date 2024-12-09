import jwt from 'jsonwebtoken';
import express from 'express';

const Authmiddleware = (req: express.Request , res: express.Response , next: express.NextFunction ) => {

    const { token } = req.cookies;

    if(token === undefined) {
        res.status(400).json({ message: 'no valid token' });
        return;
    }
    
    const istoken = jwt.verify(token.token, process.env.JWT_SECRET as string);

    if(istoken){
       next();
    }
}

export default Authmiddleware