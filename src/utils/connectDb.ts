import mongoose from "mongoose";

if (!process.env.DATABASE_URL) {
    throw new Error('Please add the database url in the .env file');
}

const DATABASE_URL: string = process.env.DATABASE_URL;

let globalWithMongoose = global as typeof globalThis & {
    mongoose: any;
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
    cached = globalWithMongoose.mongoose ={ conn: null, promise: null };
}

async function connectDb() {
    if (cached.conn) {
        return cached.conn;
    }

    //avoid reconnection while waiting for promise
    if (!cached.promise) {
        const options = {
            bufferCommands: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        cached.promise = mongoose.connect(DATABASE_URL, options)
            .then((mongoose) => {
                console.log("Database successfully connected!");
                return mongoose;
            })
            .catch((error) => {
                console.log(error as Error);
            });
    }
    cached.conn = await cached.promise;
    return cached.conn;
};

export default connectDb;