import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { handleResponse } from "../../utils/helper";

interface Jwt_Payload extends JwtPayload{
 userId: number;
 email: string;
 iat: number;
 exp: number;
}

const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    
    const { token } = req.cookies;

    if(!token){
        handleResponse(res, 400, "Access Denied");
        return;
    }

    const isToken: Jwt_Payload = jwt.verify(token, process.env.JWT_SECRET as string) as Jwt_Payload
    
    if(isToken.email === process.env.ADMIN_EMAIL){
        next();
    }
    else{
        handleResponse(res, 400, "Request not valid");
    }
}

export default adminAuthMiddleware;
