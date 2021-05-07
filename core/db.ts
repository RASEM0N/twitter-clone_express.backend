import * as mongoose from 'mongoose'

async function connectDB() {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        dbName: 'TwitterClone'
    })

    console.log(`MongoDb connected: ${conn.connection.host}`)
}

export default connectDB