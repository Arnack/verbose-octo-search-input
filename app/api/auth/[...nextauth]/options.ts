import {
  LOGIN_ENDPOINT,
  REFRESH_TOKEN_ENDPOINT,
  TOCKEN_EXPIRATION_TIMEOUT,
} from "@/app/service/constants";
import type { NextAuthOptions, Session } from "next-auth";
import axios from "axios";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

interface CustomUser extends AdapterUser {
  accessToken: string;
  refreshToken: string;
  expires: number;
}

const refreshAccessToken = async (token: JWT) => {
  try {
    const tokenResponse = await axios.post(REFRESH_TOKEN_ENDPOINT, {
      refresh_token: token.refreshToken,
    });

    return {
      ...token,
      accessToken: tokenResponse.data.access_token,
      accessTokenExpires: Date.now() + TOCKEN_EXPIRATION_TIMEOUT,
      refreshToken: tokenResponse.data.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token: ", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

const providers = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      try {
        const user = await axios.post(LOGIN_ENDPOINT, {
          password: credentials?.password,
          email: credentials?.email,
        });

        if (user.data.access_token) {
          return user.data; // TODO exires should be added
        }
        return null;
      } catch (error) {
        throw new Error(error as string);
      }
    },
  }),
];

const callbacks = {
  jwt: async ({ token, user }) => {
    if (user) {
      console.log("user 67 >>>>", user);
      // token.accessToken = user.data.accessToken;
      token.accessToken = (user as CustomUser).accessToken;
      token.accessTokenExpires = Date.now() + TOCKEN_EXPIRATION_TIMEOUT;
      token.refreshToken = (user as CustomUser).refreshToken;
    }

    const shouldRefreshTime = Math.round(
      token.accessTokenExpiry - 60 * 1000 - Date.now()
    );

    // If the token is still valid, just return it.
    if (shouldRefreshTime > 0) {
      return Promise.resolve(token);
    }
    // If the call arrives after 23 hours have passed, we allow to refresh the token.
    token = refreshAccessToken(token);
    return Promise.resolve(token);
  },
  session: async ({ session, token }) => {
    console.log("session 85 >>>>", session);
    // Here we pass accessToken to the client to be used in authentication with your API
    session.accessToken = token.accessToken;
    session.accessTokenExpiry = token.accessTokenExpiry;
    session.error = token.error;

    return Promise.resolve(session);
  },
};

export const options: NextAuthOptions = {
  providers,
  callbacks,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
    signOut: "/signin",
  },
};
