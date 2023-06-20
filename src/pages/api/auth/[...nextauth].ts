import NextAuth, { Account, Profile, User } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import clientPromise from "@/lib/mongodb"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { Adapter } from "next-auth/adapters"
import { JWT } from "next-auth/jwt"

// For more information on each option (and a full list of options) go to
// https://authjs.dev/reference/providers/oauth
export default NextAuth({
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }:
      {
        token: JWT;
        user?: User | Adapter | undefined;
        account?: Account | null | undefined;
        profile?: Profile | undefined;
        isNewUser?: boolean | undefined;
      }) {
      if (user) {
        token.provider = account?.provider;
      }
      console.log(token)
      return token
    },

    async session({ session, token }:
      {
        session: any;
        token: JWT
      }) {
        if(session.user){
          session.user.provider =  token.provider;
        }
      return session
    },
  }
})