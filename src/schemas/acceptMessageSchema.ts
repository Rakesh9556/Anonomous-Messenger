import {z} from 'zod';

export const acceptMessageSchema = z.object({
    isacceptingMessage: z.boolean()
})