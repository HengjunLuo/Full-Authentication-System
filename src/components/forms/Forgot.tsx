import * as React from 'react';
import Input from '../inputs/Input';
import { AiOutlineMail, AiFillLock } from "react-icons/ai";
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SlideButton from '../buttons/SlideButton';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Link from 'next/link';
import axios from 'axios';

interface IForgotformProps {}

const FormSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});
type FormSchemaType = z.infer<typeof FormSchema>;
const Forgotform: React.FunctionComponent<IForgotformProps> = (props) => {
    const router = useRouter();
    const path = router.pathname;
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormSchemaType>({ resolver: zodResolver(FormSchema) });
    const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
        try{
            console.log('what');
            const {data} = await axios.post('api/auth/forgot',{
                email: values.email,
            });
            toast.success(data.message);
        }catch(error:any){
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='w-full px-12 py-4'>
            <h2 className='text-center text-2xl font-bold tracking-wide text-gray-800'>
                Forgot password
            </h2>
            <p className="text-center text-sm text-gray-6000 mt-2">
                Sign in instead ? &nbsp;
                <Link href="/auth" className='text-blue-600 hover:text-blue-800 hover:underline cursor-pointer'>
                    Sign In
                </Link>
            </p>
            <form
                className='my-8 text-sm' onSubmit={handleSubmit(onSubmit)}>
                {/*-------------Email Input-------------*/}
                <Input name="email" label="Email address" type="text" icon={<AiOutlineMail />} placeholder="abcd@efg.com" register={register} error={errors?.email?.message} disabled={isSubmitting}></Input>
                {/*-------------Fancy slide submit button-------------*/}
                <SlideButton type='submit' text='Send Reset Email' slide_text='Secured' icon={<AiFillLock />} disabled={isSubmitting}></SlideButton>
            </form>
        </div>);
};

export default Forgotform;
