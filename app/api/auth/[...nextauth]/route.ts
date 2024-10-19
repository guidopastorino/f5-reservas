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
      // { user, account, profile } proveen información acerca de la cuenta de Google autenticada y registrada
      // El campo 'googleId' es un identificador único proporcionado por Google para cada usuario
      // que se autentica usando Google. Esto nos permite identificar de manera confiable al
      // usuario independientemente de cambios en su dirección de correo electrónico. 
      // Al utilizar 'googleId', evitamos duplicación de cuentas y aseguramos que el usuario
      // pueda iniciar sesión correctamente con Google en futuras ocasiones, incluso si cambian
      // otros datos personales como su email.
      // Los usuarios autenticados con Google NO usarán contraseña (ya que incluso no la provee el autenticador por seguridad)
      await dbConnect();
      // Función auxiliar para generar el username
      let username;
      if (profile?.name) {
        // Convertir a minúsculas y remover espacios
        username = profile?.name.toLowerCase().replace(/\s+/g, '');
      } else {
        // Generar un username aleatorio basado en el timestamp actual si no hay nombre
        const timestamp = Date.now().toString(); // Usar el timestamp actual
        username = `user${timestamp.slice(-8)}`; // Tomar los últimos 8 dígitos del timestamp
      }
      // Si es un inicio de sesión con Google
      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: profile?.email });
        if (!existingUser) {
          // Si no existe el usuario, lo creamos
          const newUser = new User({
            fullname: profile?.name,
            email: profile?.email,
            googleId: profile?.sub,
            username,
            role: 'user',
            color: generateRandomColor()
          });
          await newUser.save();
        }
      }
      return true;
    },
  }
});

export { handler as GET, handler as POST };