import axios from "axios";
import { NextPageContext } from "next";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Activate({ token }: { token: string }) {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        activateAccount();
    }, [token]);
    const activateAccount = async () => {
        try {
            const { data } = await axios.put("/api/auth/activate", { token });
            setSuccess(data.message);
        } catch (error: any) {
            setError((error?.response?.data as Error).message);
        }
    }
    return (
        <div className="h-screen flex text-center items-center justify-center">
            {
                error && (
                    <div>
                        <p className="text-red-400 tetx-lg font-bold">{error}</p>
                        <button className="bg-blue-400 hover:bg-blue-700 text-white text-md uppercase font-bold px-8 py-2 rounded-md sm:mr-2 mb-1 ease-linear transition-all duration-200"
                            onClick={() => signIn()}>Sign In Instead</button>
                    </div>
                )
            }
            {
                success && (
                    <div>
                        <p className="text-green-400 tetx-lg font-bold">{success}</p>
                        <button className="bg-blue-400 hover:bg-blue-700 text-white text-md uppercase font-bold px-8 py-2 rounded-md sm:mr-2 mb-1 ease-linear transition-all duration-200"
                            onClick={() => signIn()}>Sign In Now</button>
                    </div>
                )
            }
        </div>
    );
}

export async function getServerSideProps(ctx: NextPageContext) {
    const { query } = ctx;
    const token = query.token;
    console.log(token);
    return {
        props: { token },
    };
}