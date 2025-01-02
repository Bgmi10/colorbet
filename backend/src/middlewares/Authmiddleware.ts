import jwt from 'jsonwebtoken';
import express from 'express';

const Authmiddleware = (req: express.Request , res: express.Response , next: express.NextFunction ) => {

    const { token } = req.cookies;

    if(!token) {
        res.status(400).json({ message: 'Access Denied' });
        return;
    }
    
    const istoken: any = jwt.verify(token, process.env.JWT_SECRET as string);

    if(istoken){
        //@ts-ignore
       req.user = istoken;
       //@ts-ignore
       req.token = istoken;
       next();
    }
}

export default Authmiddleware