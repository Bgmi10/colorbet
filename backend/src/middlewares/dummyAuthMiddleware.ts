import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function dummyAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const { token } = req.cookies;

    const isValidToken = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!isValidToken) {
        res.json({ message: "Invalid Token" });
        return;
    }

    next();
}