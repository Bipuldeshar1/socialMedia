import mongoose from "mongoose";

const connect=async()=>{
    const DBName=process.env.DB_Name
    const MONGODBURL=process.env.MONGODB_URL
  
    try {
        const connection= await mongoose.connect(`${MONGODBURL}${DBName}`)
        console.log(`mongodb connected to ${connection.connection.host}`);
    } catch (error) {
        console.log(`connection failed ${error}`);
        process.exit(1)
    }
}

export default connect