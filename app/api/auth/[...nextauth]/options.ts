import { LOGIN_ENDPOINT, REFRESH_TOKEN_ENDPOINT, TOCKEN_EXPIRATION_TIMEOUT } from "@/app/service/constants";
import type { NextAuthOptions } from 'next-auth'
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

interface CustomUser extends AdapterUser {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
}

async function refreshAccessToken(token: JWT & { refreshToken: string }) {
  try {
    const response = await fetch(REFRESH_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: Date.now() + TOCKEN_EXPIRATION_TIMEOUT, 
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const response = await fetch(LOGIN_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            password: credentials?.password,
            email: credentials?.email,
          })
        });

        const data = await response.json();

        console.log('data >>>>', data);
        

        return data.access_token ?
          {
            ...data,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            accessTokenExpires: Date.now() + TOCKEN_EXPIRATION_TIMEOUT,
          } :
          null;
      },
    }),
  ],

  
  callbacks: {
    async jwt({ token, user } : { token: JWT, user: CustomUser }) {
      if (user) {
        return {
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        accessTokenExpires: Date.now() + TOCKEN_EXPIRATION_TIMEOUT,
      } }

      console.log('token >>>>', token);
      

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

       return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  }
};
