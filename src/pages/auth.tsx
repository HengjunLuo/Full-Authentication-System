import Background from '@/components/Backgrounds/Background'
import Registerform from '@/components/forms/Register'
import Loginform from '@/components/forms/Login'
import React from 'react'
import { NextPageContext } from 'next'
import { getCsrfToken, getProviders } from 'next-auth/react'
import SocialButton from '@/components/buttons/SocialButton'

export default function auth({ tab, callbackUrl, csrfToken, providers }: { tab: string, callbackUrl: string, csrfToken: string, providers: any }) {
    return (
        <div className='w-full flex items-center justify-center'>
            <div className='w-full h-100 flex items-center justify-center'>
                {/*----------Registry Form----------*/}
                <div className='w-full sm:w5/6 md:w-2/3 lg:w1/2 xl:w-1/3 2xl:w-1/3 h-full bg-white flex flex-col items-center justify-center'>
                    {
                        tab == 'signin' ? <Loginform callbackUrl={callbackUrl} csrfToken={csrfToken} /> : <Registerform />
                    }
                    <div className='flex items-center justify-between'>
                        <div className='w-full h-[1px] bg-gray-300'></div>
                        <span className='text-sm uppercase mx-6 text-gray-400'>OR</span>
                        <div className='w-full h-[1px] bg-gray-300'></div>
                    </div>
                    <div className='mt-3 grid grid-cols-2 gap2'>
                        {providers.map((provider: any) => {
                            if (provider.name == 'Credentials') return;
                            return <SocialButton
                            key={provider.id}
                            id={provider.id}
                            text={tab=='signup' ? `Sign up with ${provider.name}` : `Sign in with${provider.name}`}
                            csrfToken={csrfToken}
                            />;
                        })}
                    </div>
                </div>
                {/*----------Background----------*/}
                <Background image={`'../../auth/${tab == 'signup' ? 'signup' : 'signin'}.jpg'`} />
            </div>
        </div>
    )
}

export async function getServerSideProps(ctx: NextPageContext) {
    const { req, query, } = ctx;
    const tab = query.tab ? query.tab : "signin";
    const callbackUrl = query.callbackUrl ? query.callbackUrl : process.env.NEXTAUTH_URL;
    const csrfToken = await getCsrfToken(ctx);
    const providers = await getProviders();
    return {
        props:
        {
            providers: Object.values(providers!),
            tab: JSON.parse(JSON.stringify(tab)),
            callbackUrl,
            csrfToken,
        },
    };
}