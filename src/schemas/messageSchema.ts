import {z} from 'zod';

export const messageSchema = z.object({
    message: z
    .string()
    .min(10, {message: 'content must be atleast 10 characters'})
    .max(200, {message: 'content must be below 200 characters'})
})