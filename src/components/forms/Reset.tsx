import * as React from 'react';
import Input from '../inputs/Input';
import { AiOutlineLock, AiFillLock } from "react-icons/ai";
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from "zod";
import { useState } from 'react';
import zxcvbn from "zxcvbn";
import { zodResolver } from "@hookform/resolvers/zod";
import SlideButton from '../buttons/SlideButton';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Link from 'next/link';
interface IResetformProps { token: string,}

const FormSchema = z.object({
  password: z.string().min(8, "Password must be between 8~64 characters")
    .max(64, "Password must be between 8~64 characters"),
  confirmPassword: z.string(),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password unmatch!",
    path: ['confirmPassword'],
  });
type FormSchemaType = z.infer<typeof FormSchema>;
const Resetform: React.FunctionComponent<IResetformProps> = (props) => {
  const router = useRouter();
  const {token} = props;
  const path = router.pathname;
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<FormSchemaType>({ resolver: zodResolver(FormSchema) });
  const [passwordScore, setPasswordScore] = useState(0);
  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    try {
      const { data } = await axios.post("/api/auth/reset", {
        password: values.password,
        token: token,
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
        Reset password
      </h2>
      <p className="text-center text-sm text-gray-6000 mt-2">
        Sign in instead ?&nbsp;
        <Link href="/auth" className='text-blue-600 hover:text-blue-800 hover:underline cursor-pointer'>
          Sign in
        </Link>
      </p>

      <form className='my-8 text-sm' onSubmit={handleSubmit(onSubmit)}>
        {/*-------------Password and confirm password Inputs-------------*/}
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
        {/*-------------Fancy slide submit button-------------*/}
        <SlideButton type='submit' text='Reset' slide_text='Secure reset' icon={<AiFillLock />} disabled={isSubmitting}></SlideButton>
      </form>
    </div>);
};

export default Resetform;
