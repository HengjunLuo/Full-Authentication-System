// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from '@/models/User';
import connectDb from '@/utils/connectDb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next'

const {RESET_TOKEN_SECRET} = process.env;

interface UserToken{
    id: string;
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        await connectDb();
        const {token, password} = req.body;
        const userToken = jwt.verify(token,RESET_TOKEN_SECRET!) as UserToken;
        const userDb = await User.findById(userToken.id);
        if(!userDb){
            return res.status(400).json({message:"This account doesn't exits"});
        }
        const cryptedPassword = await bcrypt.hash(password,12);
        await User.findByIdAndUpdate(userDb.id, {password: cryptedPassword});
        res.json({ 
            message: "Password updated successfully!"
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

