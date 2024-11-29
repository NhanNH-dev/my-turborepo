import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "app/lib/prisma";
import User from "app/lib/models/User";
import bcrypt from "bcrypt";
import PrismaAdapter from "@next-auth/prisma-adapter";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Lấy người dùng từ Prisma
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        // Kiểm tra mật khẩu và trả về người dùng nếu hợp lệ
        if (user && user.password === credentials?.password) {
          return user;
        }
        return null;
      },
    })
  ],
  adapter: PrismaAdapter(prisma), // Dùng Prisma Adapter
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        // Lấy các thông tin từ profile của Google
        const { email, sub: googleId, name, picture } = profile;
  
        if (!googleId) {
          console.error("Google ID không có (null), không thể tạo người dùng!");
          return false;
        }

        let existingUser = await User.findOne({ email });

        if (!existingUser) {
          existingUser = await User.create({
            email,
            username: name || googleId,
            password: null,
            provider: "google",
            profilePicture: picture,
          });
        }
  
        console.log("Google User:", existingUser);
      }
      return true;
    }
  }
});

export { handler as GET, handler as POST };
