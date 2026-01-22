import {z} from "zod";

export const LoginRequest = z.object({
    username : z.string(),
    password : z.string(),
})