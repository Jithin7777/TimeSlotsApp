import mongoose from 'mongoose'

const connectToDB=()=>{
    const connectionString=process.env.MONGODB_URI
mongoose.connect(connectionString)
.then(()=>console.log('Availabilty_App database connection successfull'))
.catch((error)=>console.log(error));

}

export default connectToDB