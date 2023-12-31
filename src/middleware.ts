import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req:NextRequest){
    const {pathname, origin } = req.nextUrl;
    const session = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        //secureCookie: true//process.env.NODEENV === "production",
    });
    if(pathname=="/"){
        if(!session){
            console.log("secure?")
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth`);
        }
    }
    if(pathname == "/auth"){
        if(session){
            return NextResponse.redirect(`${origin}`);
        }
    }
    /*if(pathname.startsWith('/admin')){
        if(session) return NextResponse.redirect(`${origin}`);
        if(session.role=='admin') return NextResponse.redirect(`${origin}`);
    }*/
}