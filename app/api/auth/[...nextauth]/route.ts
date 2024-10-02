import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usernameOrEmail: { label: "Usuario o Email", type: "text", placeholder: "Usuario o Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if(!credentials) throw new Error("No credentials provided");

        await dbConnect();

        const { usernameOrEmail, password } = credentials;
        
        // Buscar usuario por email o username
        const user = await User.findOne({
          $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
        });

        if (!user) {
          throw new Error("No se encontró el usuario");
        }

        // Comparar la contraseña
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta");
        }

        // Devolver el usuario si la autenticación es exitosa
        return { id: user._id, name: user.fullname, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
    maxAge: 604800 // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  }
});

export { handler as GET, handler as POST };
