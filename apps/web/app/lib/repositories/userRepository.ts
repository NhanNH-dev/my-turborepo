import { MongoClient, Db, Collection } from "mongodb";

let db: Db;

const connectDB = async () => {
  if (!db) {
    const client = new MongoClient(process.env.MONGO_URI!);
    await client.connect();
    db = client.db("connectdb");
  
  }
  return db;
};

export interface User {
  username: string;
  email?: string;
  password: string;
  provider: string
}

export const UserRepository = {
  async getAllUsers(): Promise<User[]> {
    const db = await connectDB();
    const collection: Collection<User> = db.collection("users");
    return await collection.find({}).toArray();
  },

  async getUserByUsername(username: string): Promise<User | null> {
    const db = await connectDB();
    const collection: Collection<User> = db.collection("users");
    return await collection.findOne({ username });
  },

  async createUser(user: User): Promise<void> {
    const db = await connectDB();
    const collection: Collection<User> = db.collection("users");
    await collection.insertOne(user);
  },
};
