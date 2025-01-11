import express from "express";

export const handleResponse = (res: express.Response, status: number, message: string, data: any = null) => {
   res.status(status).json({ message, data });
}