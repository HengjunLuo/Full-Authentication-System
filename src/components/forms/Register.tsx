import * as React from 'react';
import Input from '../inputs/Input';
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineLock } from "react-icons/ai";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import validator from 'validator';
import { useState } from 'react';
import zxcvbn from "zxcvbn";
import { zodResolver } from "@hookform/resolvers/zod";
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
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password unmatch!",
    path: ['confirmPassword'],
  });
type FormSchemaType = z.infer<typeof FormSchema>;
const Registerform: React.FunctionComponent<IRegisterformProps> = (props) => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormSchemaType>({ resolver: zodResolver(FormSchema) });
  const [passwordScore, setPasswordScore] = useState(0);
  const onSubmit = (data: any) => console.log(data);
  const calcPwdStrength = () => {
    let password = watch().password;
    return zxcvbn(password ? password : '').score;
  }
  React.useEffect(() => {
    setPasswordScore(calcPwdStrength());
  }, [watch().password])
  return (
    <form className='my-8 text-sm' onSubmit={handleSubmit(onSubmit)}>
      <div className='gap-2 md:flex flex-col'>
        <Input name="first_name" label="First name" type="text" icon={<AiOutlineUser />} placeholder="Enter first name here" register={register} error={errors?.first_name?.message} disabled={isSubmitting}></Input>
        <Input name="last_name" label="Last name" type="text" icon={<AiOutlineUser />} placeholder="Enter last name here" register={register} error={errors?.last_name?.message} disabled={isSubmitting}></Input>
        <Input name="email" label="Email address" type="text" icon={<AiOutlineMail />} placeholder="abcd@efg.com" register={register} error={errors?.email?.message} disabled={isSubmitting}></Input>
        <Input name="phone" label="Phone number" type="text" icon={<AiOutlinePhone />} placeholder="+(xxx) xxx-xxx-xxx" register={register} error={errors?.phone?.message} disabled={isSubmitting}></Input>
        <Input name="password" label="Password" type="text" icon={<AiOutlineLock />} placeholder="Enter password here" register={register} error={errors?.password?.message} disabled={isSubmitting}></Input>
        {
          watch().password?.length > 0 && <div className='flex mt-2'>
            {Array.from(Array(5).keys()).map((span, i) => (
              <span className='w-1/5 px-1' key={i}>
                <div className={`h-2 rounded-xl 
                ${
                  passwordScore<=2 ? "bg-red-400"
                  : passwordScore <4 ? "bg-yellow-400"
                  : "bg-green-400"
                }`}></div>
              </span>
            ))}
          </div>
        }
        <Input name="confirmPassword" label="Confirm Password" type="text" icon={<AiOutlineLock />} placeholder="Re-enter password here" register={register} error={errors?.confirmPassword?.message} disabled={isSubmitting}></Input>
      </div>
      <button type='submit'>Submit</button>
    </form>);
};

export default Registerform;
