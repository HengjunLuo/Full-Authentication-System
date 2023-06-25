import * as React from 'react';
import Input from '../inputs/Input';
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineLock, AiFillLock } from "react-icons/ai";
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from "zod";
import validator from 'validator';
import { useState } from 'react';
import zxcvbn from "zxcvbn";
import { zodResolver } from "@hookform/resolvers/zod";
import SlideButton from '../buttons/SlideButton';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
interface IRegisterformProps { }

const FormSchema = z.object({
  first_name: z.string().min(2, "First name must be between 2-32 characters")
    .max(32, "First name must be between 2-32 characters")
    .regex(new RegExp("^[a-zA-Z]+$"), "No special characters allowed"),
  last_name: z.string().min(2, "Last name must be between 2-32 characters")
    .max(32, "Last name must be between 2-32 characters")
    .regex(new RegExp("^[a-zA-Z]+$"), "No special characters allowed"),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().refine(validator.isMobilePhone, {
    message: "Please enter a valid phone number"
  }),
  password: z.string().min(8, "Password must be between 8~64 characters")
    .max(64, "Password must be between 8~64 characters"),
  confirmPassword: z.string(),
  accept: z.literal(true, {
    errorMap: () => ({
      message: "Please agree to all the terms and conditions before continuing."
    })
  })
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password unmatch!",
    path: ['confirmPassword'],
  });
type FormSchemaType = z.infer<typeof FormSchema>;
const Registerform: React.FunctionComponent<IRegisterformProps> = (props) => {
  const router = useRouter();
  const path = router.pathname;
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<FormSchemaType>({ resolver: zodResolver(FormSchema) });
  const [passwordScore, setPasswordScore] = useState(0);
  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    try {
      const { data } = await axios.post("/api/auth/signup", {
        ...values,
      });
      reset();
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };
  const calcPwdStrength = () => {
    let password = watch().password;
    return zxcvbn(password ? password : '').score;
  }
  React.useEffect(() => {
    setPasswordScore(calcPwdStrength());
  }, [watch().password])
  return (
    <div className='w-full px-12 py-4'>
      <h2 className='text-center text-2xl font-bold tracking-wide text-gray-800'>
        Sign up
      </h2>
      <p className="text-center text-sm text-gray-6000 mt-2">
        Already have an account? &nbsp;
        <a onClick={()=>{
                    router.push({
                        pathname:path,
                        query:{
                            tab:'signin',
                        },
                    });
                }} className='text-blue-600 hover:text-blue-800 hover:underline cursor-pointer'>
          Sign in
        </a>
      </p>

      <form className='my-8 text-sm' onSubmit={handleSubmit(onSubmit)}>
        {/*------------Name Inputs-------------*/}
        <div className='gap-2 md:flex'>
          <Input name="first_name" label="First name" type="text" icon={<AiOutlineUser />} placeholder="E.g. Jhon" register={register} error={errors?.first_name?.message} disabled={isSubmitting}></Input>
          <Input name="last_name" label="Last name" type="text" icon={<AiOutlineUser />} placeholder="E.g. Joe" register={register} error={errors?.last_name?.message} disabled={isSubmitting}></Input>
        </div>
        {/*-------------Email, Phone, password and confirm password Inputs-------------*/}
        <Input name="email" label="Email address" type="text" icon={<AiOutlineMail />} placeholder="abcd@efg.com" register={register} error={errors?.email?.message} disabled={isSubmitting}></Input>
        <Input name="phone" label="Phone number" type="text" icon={<AiOutlinePhone />} placeholder="+(xxx) xxx-xxx-xxx" register={register} error={errors?.phone?.message} disabled={isSubmitting}></Input>
        <Input name="password" label="Password" type="password" icon={<AiOutlineLock />} placeholder="Enter password here" register={register} error={errors?.password?.message} disabled={isSubmitting}></Input>
        {/*Check for password strenghth*/
          watch().password?.length > 0 && <div className='flex mt-2'>
            {Array.from(Array(5).keys()).map((span, i) => (
              <span className='w-1/5 px-1' key={i}>
                <div className={`h-2 rounded-xl 
                ${passwordScore <= 2 ? "bg-red-400"
                    : passwordScore < 4 ? "bg-yellow-400"
                      : "bg-green-400"
                  }`}></div>
              </span>
            ))}
          </div>
        }
        <Input name="confirmPassword" label="Confirm Password" type="password" icon={<AiOutlineLock />} placeholder="Re-enter password here" register={register} error={errors?.confirmPassword?.message} disabled={isSubmitting}></Input>
        {/*-------------Accept terms and privacy condition-------------*/}
        <div className='flex items-center mt-3'>
          <input type="checkbox" id='accept' className='mr-2 focus:ring-0 rounded' {...register("accept")} />
          <label htmlFor="accept" className='text-gray-700'>
            I Accept the&nbsp;
            <a href='' target='_blank' className='text-blue-700 hover:underline'>terms</a>
            &nbsp;and&nbsp;
            <a href='' target='_blank' className='text-blue-700 hover:underline' >privacy policy</a>
          </label>
        </div>
        <div>
          {/*error message*/
            errors?.accept && <p className='text-sm text-red-500 mt-1'>{errors?.accept?.message}</p>
          }
        </div>
        {/*-------------Fancy slide submit button-------------*/}
        <SlideButton type='submit' text='Sign Up' slide_text='Secure sign up' icon={<AiFillLock />} disabled={isSubmitting}></SlideButton>
      </form>
    </div>);
};

export default Registerform;
