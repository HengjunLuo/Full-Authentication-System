// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from '@/models/User';
import connectDb from '@/utils/connectDb';
import sendMail from '@/utils/sendMail';
import { createResetToken } from '@/utils/tokens';
import { resetPasswordEmail } from '@/emailTemplates/reset';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        await connectDb();
        console.log('what');
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'This user email does not exist.'});
        }
        const user_id = createResetToken({
            id: user._id.toString(),
        });
        const url = `${process.env.NEXTAUTH_URL}/reset/${user_id}`;
        await sendMail(email,user.name,user.image,url,"Reset your password - Full Authentication System", resetPasswordEmail);
        res.json({ 
            message: "Reset password email sent!"
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

