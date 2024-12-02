import { z } from "zod";

export const userSchema = z.object({
    email : z.string(),
    password : z.string(),
    name : z.string()
})