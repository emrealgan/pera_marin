import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB, disconnectDB } from "@/app/lib/db";
import { admin } from "@/app/lib/models";

declare module "next-auth" {
    interface Session {
      user: {
        role?: string | null;
      };
    }
  
    interface User {
      role?: string | null;
    }
  
    interface JWT {
      role?: string | null;
    }
  }
  
  const authOptions: NextAuthOptions = ({
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
        },
        authorize: async (credentials) => {
          if (!credentials) return null;
  
          try {
            await connectDB();
            const user = await admin.findOne({
              username: credentials.username,
              password: credentials.password,
            });
            await disconnectDB();
  
            if (user) {
              return {
                role: "admin",
              } as User;
            } else {
              return null;
            }
          } catch (error) {
            console.error("Error during authorization:", error);
            return null;
          }
        },
      }),
    ],
    callbacks: {
      async session({ session, token }) {
        if (token && session.user) {
          session.user.role = token.role as string | null;
        }
        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.role = user.role;
        }
        return token;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  });
  export default authOptions;
