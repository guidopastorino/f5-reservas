import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { generateRandomColor } from "@/utils/generateRandomColor";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usernameOrEmail: { label: "Usuario o Email", type: "text", placeholder: "Usuario o Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("No credentials provided");

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
    },
    // for google signin
    async signIn({ user, account, profile }) {
      await dbConnect();
    
      let username = profile?.name?.toLowerCase().replace(/\s+/g, '') || `user${Date.now().toString().slice(-8)}`;
    
      try {
        const existingUser = await User.findOne({ email: profile?.email });
    
        if (account?.provider === "google") {
          if (existingUser) {
            // Si el usuario ya existe y no tiene googleId
            if (!existingUser.googleId) {
              existingUser.googleId = profile?.sub; // Asociar la cuenta de Google al usuario existente
              await existingUser.save();
            }
            // Devolver true ya que el usuario ya está asociado a Google
            return true;
          } else {
            // Si no existe el usuario, creamos uno nuevo
            const newUser = new User({
              fullname: profile?.name,
              email: profile?.email,
              googleId: profile?.sub,
              username,
              role: 'user',
              color: generateRandomColor(),
            });
            await newUser.save();
            return true; // Usuario creado exitosamente
          }
        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return false; // Retornar false en caso de error
      }
    
      return false; // Retornar false si el proveedor no es Google
    }
  }
});

export { handler as GET, handler as POST };