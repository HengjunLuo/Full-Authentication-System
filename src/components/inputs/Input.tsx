import * as React from 'react';

interface IInputProps {
    name: string;
    label: string;
    type: string;
    icon: JSX.Element;
    placeholder: string;
}

const Input: React.FunctionComponent<IInputProps> = (props) => {
    const { name, label, type, icon, placeholder } = props;
    return (
        <div className='relative mt-1 rouned-md shadow-sm'>
            <div className="pointer-event-none absolute left-0 inset-y-0 flex items-center pl-3">
                <span className="text-gray-500 text-sm">{icon}</span>
            </div>
            <input
                type={type}
                className='w-full py-2 pr-7 pl-8 block rounded-md border-gray-300 outline-offset-2 outline-transparent focus:border-blue-500 focus:ring-indigo-500 focus:ring-2 text-sm'
                placeholder={placeholder}
            />
        </div>);
};

export default Input;
