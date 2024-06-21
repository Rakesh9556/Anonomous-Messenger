import {z} from "zod";

export const usernameValidation = z
.string()
.min(2, {message: 'Username must be atleast 2 characters'})
.max(12, {message:'Username must be below 12 characters'})
.regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain speacial character')

export const fullnameValidation = z
.string()
.min(4, {message: 'fullname must be atleast 6 characters'})
.max(20, {message: 'fullname must be below 20 characters'})


export const signUpSchema = z.object({
    username: usernameValidation,
    fullname: fullnameValidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: 'password must be atleast 6 characters'}).max(20, {message: 'password must be below 20 characters'})


})