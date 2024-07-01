import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { any } from "zod";


// exporting options to use in //route.js
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "text", type: "text", placeholder: "Enter your username or email" },
                password: { label: "Password", type: "Enter your password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        // we will find the user through email or username
                        $or:[
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    
                    // if user not exist
                    if(!user) {
                        throw new Error("No user found with this username or email")
                    }

                    // check if user is verified or not
                    if (!user.isVerified) {
                        throw new Error("User is not verified with this email. Please verify")
                    }

                    // if user is verified, validate the password by comparing with the password stored  in the db
                    const isPasswordCorrect = await bcrypt.compare(user.password, credentials.password)

                    // check if password is correct or not
                    if (isPasswordCorrect) {
                        return user;
                    }
                    else {
                        throw new Error("Invalid password")
                    }
                    
                } catch (err: any) {
                    throw new Error(err);
                }

            }
        }),

        // we will add more credentials to this
    ],
    callbacks: {
        async jwt({ token, user}) {
            if(user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
                token.username = user.username
            }
            return token
          },

        async session({ session, token }) {
            if(token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }
            return session
          },
          
    },

    pages: {
        signIn: '/sign-in',
    },

    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,

}