// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from '@/models/User';
import connectDb from '@/utils/connectDb';
import type { NextApiRequest, NextApiResponse } from 'next'
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { createActivatonToken } from '@/utils/tokens';
import { activateTemplateEmail } from '@/emailTemplates/activate';
import sendMail from '@/utils/sendMail';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try{
        await connectDb();
    const { first_name, last_name, email, phone, password } = req.body;
    /*Validate sign up info*/
    if (!first_name || !last_name || !email || !phone || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Please fill a valid email address" });
    }
    if (!validator.isMobilePhone(phone)) {
        return res.status(400).json({ message: "Please fill a valid mobile phone number" });
    }
    const user = await User.findOne({
        email: email,
    });
    if (user) {
        return res.status(400).json({ message: "This email address already exists." });
    }
    if (password.length < 6 || password.length > 64) {
        return res.status(400).json({ message: "Password must be betwwen 8~64 characters." });
    }
    const cryptPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
        name: `${first_name+" "+last_name}`,
        email,
        phone,
        password: cryptPassword,
    });
    await newUser.save();
    const activation_token = createActivatonToken({
        id:newUser._id.toString(),
    });
    const url =`${process.env.NEXTAUTH_URL}/activate/${activation_token}`;
    await sendMail(
        newUser.email, newUser.name, '',url,'Activate your account - Full Authentication System', activateTemplateEmail
    );
    res.json({
         message: "Success! We have send a activation email to your email address."
    });
    }catch(error){
        res.status(500).json({message:(error as Error).message});
    }
}

