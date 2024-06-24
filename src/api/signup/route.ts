import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


async function POST(request: Request) {
    await dbConnect()

    try {
        const {fullname,username, email, password} = await request.json()

        // finding the user existed or not using username
        const existingUserVerifiedByName = await UserModel.findOne({username, isVerified: true})

        // check user is exist or not
        if(existingUserVerifiedByName) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                {
                    status: 400
                }
            )
        }

        // generating verifyCode
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()

        // finding the user existed or not using username
        const existingUserByEmail = await UserModel.findOne({email})

        // check if user is exist or not
        if(existingUserByEmail) {
            // if user exist and verified
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exist with this email"
                    },
                    {
                        status: 400
                    }
                )
            }
            else{
                // if user exist and not verified
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                // save the user
                existingUserByEmail.save()
            }
        }
        else{
            // if user not exists
            // reigister the user
            const hashedPassword = await bcrypt.hash(password, 10)

            // set the expiry dates
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            // define the new user
            const newUser = new UserModel({
                username,
                fullname,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate, 
                isVerified: false,
                isAcceptinngMessage: true, 
                messages:[]
            })

            // save the created new user
            await newUser.save()

        }

        // now the user has registered, we need to send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
 
        // if email not sent
        if(emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 400
                }
            )
        }

        // if email not sent succesfully
        return Response.json(
            {
                success: true,
                message: "User registered succesfully. Verify your email"
            },
            {
                status: 201
            }
        )
        
    } catch (error) {
        console.log("Error registering user");
        return Response.json(
            {
                success: false,
                message: "Error while registering user"
            },
            {
                status: 500
            }
        )
        
    }
}