import { z } from "zod";

export const signinSchema = z.object({
    email : z.string(),
    password : z.string(),
    name : z.string()
});

export const loginSchema = z.object({
    email: z.string(),
    password: z.string()
});

export const emailSchema = z.object({
    email: z.string()
});

export const email_and_otp_schema = z.object({
    email: z.string(),
    otp: z.string()
});

export const forget_passoword_schema = z.object({
    email: z.string(),
    newpassword: z.string()
})