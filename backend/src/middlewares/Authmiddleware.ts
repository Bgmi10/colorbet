import jwt from 'jsonwebtoken';
import express from 'express';

const Authmiddleware = (req: express.Request , res: express.Response , next: express.NextFunction ) => {

    const { token } = req.cookies;

    console.log(token);

    if(token === undefined) {
        res.status(400).json({ message: 'Access Denied' });
        return;
    }
    
    const istoken: any = jwt.verify(token.token, process.env.JWT_SECRET as string);

    if(istoken){
        //@ts-ignore
       req.user = istoken;
       next();
    }
}

export default Authmiddleware