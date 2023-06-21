import * as React from 'react';
import Input from '../inputs/Input';
import {AiOutlineUser} from "react-icons/ai"

interface IRegisterformProps {
}

const Registerform: React.FunctionComponent<IRegisterformProps> = (props) => {
  return (
  <form className='my-8 text-sm'>
    <div className='gap-2 md:flex'>
        <Input name="first_name" label="First_name" type="text" icon={<AiOutlineUser/>} placeholder="example"></Input>
    </div>
  </form>);
};

export default Registerform;
