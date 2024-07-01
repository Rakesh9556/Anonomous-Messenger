import mongoose, {Schema, Document} from "mongoose";

// Type defining
export interface Message extends Document{
    content: string;
    createdAt: Date;
}

export interface User extends Document {
    username: string;
    fullname: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage:boolean;  
    messages: Message[]
}



// Message Schema
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,

    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
        
    }
})

// User Schema

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        // email validation
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "valid email is requred"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    verifyCode: {
        required: [true, "Verify Code is required"]
    },
    verifyCodeExpiry: {
        required: [true, "Verify Code is required"]
    },
    isVerified: {
        required: true,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
})


// creating the model
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;
