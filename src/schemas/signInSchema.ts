import {z} from 'zod';

export const signInSchema = z.object({
    // username or email is an identifier
    identifier: z.string(),
    password: z.string()
})