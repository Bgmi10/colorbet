import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface CustomReq  extends Request{
    user?: string | JwtPayload;
    token?: string
}

interface Token extends JwtPayload{
    email: string;
    iat: number;
    exp: number;
    userId: string
}
const Authmiddleware = (req: CustomReq , res: Response , next: NextFunction ) => {

    const { token } = req.cookies;

    if(!token) {
        res.status(400).json({ message: 'Access Denied' });
        return;
    }
    
    const istoken: Token = jwt.verify(token, process.env.JWT_SECRET as string) as Token;

    if(istoken){
       req.user = istoken;
       req.token = token;
       next();
    }
}

export default Authmiddleware