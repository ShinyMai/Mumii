import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // In production, this would check against a database
        // For now, we'll use mock users
        const mockUsers = [
          {
            id: "1",
            email: "user@mumii.com",
            password:
              "$2a$12$8yNvEHOplIkNUQQD.Zy5WOTqJGD9Zd6aW0Y4EyMkE8vEsSpKGl4Uy", // password123
            name: "John Doe",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
          },
          {
            id: "2",
            email: "foodie@mumii.com",
            password:
              "$2a$12$8yNvEHOplIkNUQQD.Zy5WOTqJGD9Zd6aW0Y4EyMkE8vEsSpKGl4Uy", // password123
            name: "Jane Smith",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
          },
        ];

        const user = mockUsers.find((u) => u.email === credentials.email);

        if (user && (await compare(credentials.password, user.password))) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
