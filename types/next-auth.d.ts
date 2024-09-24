import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string; // Agrega el campo "id" opcional
    } & Session["user"];
  }
}