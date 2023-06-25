import { signIn } from 'next-auth/react';
import * as React from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';

interface ISocialButtonProps {
    id: string,
    text: string,
    csrfToken: string,
}

const colors: any = {
    google: "#DB4437",
    github : "#333",
}

const SocialButton: React.FunctionComponent<ISocialButtonProps> = (props) => {
    const { id, text, csrfToken } = props;
    const createIconJsx = () => {
        switch (id) {
            case 'google': return <FaGoogle />;
            case 'github': return <FaGithub />
        }
    }
    return (
        <form method='post' action={`/api/auth/signin/${id}`}>
            <input type="hidden" name='csrfToken' defaultValue={csrfToken} />
            <button className='mr-2 mb-2 py-2 px-4 flex justify-center items-center gap-2 hover:bg-gray-700 focus:ring-2 ease-in-out transition-all duration-500 rounded-md text-white text-base font-semibold shadow-md easfocus:outline-none focus:ring-offset-2' type='button'
                onClick={() => signIn(id)}
                style={{background:`${colors[id]}`}}
                >
                    {createIconJsx()}
                {text}
            </button>
        </form>
    );
};

export default SocialButton;
