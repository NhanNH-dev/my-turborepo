import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../lib/models/User';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Kết nối tới MongoDB
        await connectToDatabase();

        // Kiểm tra người dùng qua email
        const user = await User.findOne({ email: credentials?.email });

        if (!user) {
          throw new Error("the email isn't register");
        }

        // Kiểm tra mật khẩu nếu có (chỉ khi người dùng đăng nhập qua email/password)
        if (credentials?.password && user.provider !== 'google') {
          const isPasswordValid = await user.comparePassword(credentials?.password);
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }
        }

        // Trả về thông tin người dùng nếu đăng nhập thành công
        return { id: user._id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: {user: any, account: any}) {
      if (account.provider === "google") {
        const { name, email } = user;
        try {
          await connectToDatabase();
          const userExists = await User.findOne({ email });

          if (!userExists) {
            const res = await fetch("http://localhost:3000/api/signup", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name,
                email,
                provider: account.provider,
                password: null
              }),
            });

            if (res.ok) {
              return user;
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      return user;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };