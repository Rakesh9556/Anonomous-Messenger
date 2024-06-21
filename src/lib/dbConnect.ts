import { log } from "console";
import mongoose from "mongoose";

// "type" -keyword is suitable to use when you want to define generic types that can work with multiple data types
// generic types means can be used with differnt data type (ex: string, number, object, etc)


// we will introduce a little much type safety here to know the value coming after the database connection is of what data type
// generally the value is of Number data type
// in the below  we will check the returned value after database connection. if it returns( which is optional), then its type will be number

type ConnectionObject = {
    isConnected?: number
}

// initially it will be empty because connection has not been established yet
const connection: ConnectionObject = {}  


// database connection
// on database connection, the value returned will be a promise 
async function dbConnect(): Promise<void> {
    // first we will check if there is exiting database connection or not 
    // if there is connection then the returned value will be 1
    // in the below we are checking inside connection object is the isConnected property have value 1 or not 
    if (connection.isConnected) {
        console.log('Already conncted to datbase');
        return;  
    }

    try {
        // as databse is in another continent it will take time, so we will use await
        // if connecction string is not present there we can pass empty string which we will handle later
        // we can also pass other options
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
        console.log(`Database output: ${db}`);
        
        // on extracting connection array first value is readyState --> readyState says that connection readyState
        // this connection.isConnected value wit will be checked above when the user want to establish a new connetion
        connection.isConnected = db.connections[0].readyState

        console.log("DB connected successfully");  

    } catch (error) {

        console.error("DB connection failed")

        // if the connection does not happen or exist we will gracefully exit the process
        process.exit(1)
        
    }
}

// at last export the database connect method 
export default dbConnect;

