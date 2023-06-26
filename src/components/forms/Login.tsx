import * as React from 'react';
import Input from '../inputs/Input';
import { AiOutlineMail, AiOutlineLock, AiFillLock } from "react-icons/ai";
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SlideButton from '../buttons/SlideButton';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

interface ILoginformProps { callbackUrl: string, csrfToken: string }

const FormSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, "Password must be between 8~64 characters")
        .max(64, "Password must be between 8~64 characters"),

});
type FormSchemaType = z.infer<typeof FormSchema>;
const Loginform: React.FunctionComponent<ILoginformProps> = (props) => {
    const { callbackUrl, csrfToken } = props;
    const router = useRouter();
    const path = router.pathname;
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormSchemaType>({ resolver: zodResolver(FormSchema) });
    const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
        const res: any = await signIn('credentials', {
            redirect: false,
            email: values.email,
            password: values.password,
            callbackUrl,
        });
        if (res.error) {
            return toast.error(res.error);
        }else{
            return router.push('/');
        }
    }

    return (
        <div className='w-full px-12 py-4'>
            <h2 className='text-center text-2xl font-bold tracking-wide text-gray-800'>
                Sign In
            </h2>
            <p className="text-center text-sm text-gray-6000 mt-2">
                Do not have an account? &nbsp;
                <a onClick={() => {
                    router.push({
                        pathname: path,
                        query: {
                            tab: 'signup',
                        },
                    });
                }} className='text-blue-600 hover:text-blue-800 hover:underline cursor-pointer'>
                    Sign Up
                </a>
            </p>

            <form
                method='post'
                action='/api/auth/signin/email'
                className='my-8 text-sm' onSubmit={handleSubmit(onSubmit)}>
                {/*-------------Email, Phone, password and confirm password Inputs-------------*/}
                <input type='hidden' name='csrfToken' defaultValue={csrfToken} />
                <Input name="email" label="Email address" type="text" icon={<AiOutlineMail />} placeholder="abcd@efg.com" register={register} error={errors?.email?.message} disabled={isSubmitting}></Input>
                <Input name="password" label="Password" type="password" icon={<AiOutlineLock />} placeholder="Enter password here" register={register} error={errors?.password?.message} disabled={isSubmitting}></Input>
                <div>
                </div>
                {/*-------------Fancy slide submit button-------------*/}
                <SlideButton type='submit' text='Sign In' slide_text='Secure sign in' icon={<AiFillLock />} disabled={isSubmitting}></SlideButton>
                <Link href="/forgot" className='text-blue-600 hover:underline' >Fotgot Password?</Link>
            </form>
        </div>);
};

export default Loginform;
