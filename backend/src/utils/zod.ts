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
});

export const game_user_bet_record = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().default(10)
});


export const addBankAccount = z.object({
    accountNumber: z.string(),
    accountHolderName: z.string(),
    ifscCode: z.string(),
    bankName: z.string()
});

export const withdrawal = z.object({
    bankAccountId: z.number().int(),
    amount: z.number().int(),
})
