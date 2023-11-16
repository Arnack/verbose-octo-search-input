import { LOGIN_ENDPOINT, REFRESH_TOKEN_ENDPOINT } from "@/app/service/constants";
import axios from "axios";
import type { NextAuthOptions, Session } from 'next-auth'
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

interface CustomUser extends AdapterUser {
  access_token: string;
  refresh_token: string;
}

async function refreshAccessToken(token: JWT) {
  try {
    const response = await axios.post(REFRESH_TOKEN_ENDPOINT, {
      refresh_token: token.refreshToken,
    });

    const refreshedTokens = response.data;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token, 
    };
  } catch (error) {
    console.error('Error refreshing access token: ', error);
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
        const user = await axios.post(LOGIN_ENDPOINT, {
            password: credentials?.password,
            email: credentials?.email,
        });

        const { data } = user;

        if (data?.access_token) {
          return data;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {

      if (user) {
        token.accessToken = (user as CustomUser).access_token;
        token.refreshToken = (user as CustomUser).refresh_token;
      }

      if (Date.now() < (token.exp as number) * 1000) {
        return token;
      }
      
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
    signOut: '/signin',
  }
};
