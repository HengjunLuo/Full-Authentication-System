import { NextPageContext } from "next";
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import {FaGithub} from "react-icons/fa"
export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div className="home bg-black min-h-screen text-white flex items-center justify-center">
      <div className="container mx-auto">
        <div className="border border-white relative flex flex-col w-full rounded-lg">
          <div className="flex flex-wrap justify-center items-center">
            <div className="w-full text-right">
              <div className="py-6 px-3">
                <button className="bg-blue-400 hover:bg-blue-700 text-md uppercase font-bold px-8 py-2 rounded-md sm:mr-2 mb-1 ease-linear transition-all duration-200" 
                onClick={() => signOut()}>Sign Out</button>
              </div>
            </div>
            <div className="w-full justify-center flex">
              <img src={session?.user?.image} alt={`${session?.user.name} image`} className="rounded-full w-40 h-40" />
            </div>
            <div className="text-center mt-12">
              <h3 className="text-4x1 font-semibold mb-b">{session?.user?.name}</h3>
              <div className="tetx-sm mb-2 font-bold">{session?.user?.email}</div>
              <div className="mb-2 mt-10"> You Logged in using &nbsp;
                <span className="capitalize bg-blue-400 px-4 py-1 ml-2 font-bld italix text-lg rounded-md">{session?.user?.provider}</span></div>
            </div>
          </div>
          <div className="mt-10 py-10 border-t text-center">
            <div className="flex flex-wrap justify-center">
                <div className="w-full px-4">
                  <p className="mb-4 text-sm">This is an Authentication System with full functionalities.</p>
                  <p className="font-bold text-xs">This project is built using Typescript, Next.js, NextAuth.js, React.js</p>
                  <div className="mt-6 flex items-center justify-center gap2">
                    Source Code Here: &nbsp;
                    <a href="https://github.com/HengjunLuo/Full-Authentication-System" target="_blank" rel="noopener norefresher" className="text-4xl">
                    <FaGithub/>
                    </a>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);
  return {
    props: {
      session
    },
  };
}
