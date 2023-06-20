import { NextPageContext } from "next";
import { useSession, signIn, signOut, getSession } from "next-auth/react"
export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <>

      {
        session ?
          <>
            <h1 className="text-red-700 text-4xl bg-yellow-200">{session?.user?.email}</h1>
            <img src={session?.user?.image!} alt="" className="w-[128px h-32 rounded-full" />
            <button onClick={() => signOut()} className="bg-purple-200">Sign Out</button>
          </> :
          <button onClick={() => signIn()} className="bg-purple-200">Sign In</button>
      }
    </>
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
