// import { DefaultSession, DefaultUser } from "next-auth";
// import { JWT } from "next-auth/jwt";

// // Extend the built-in Session type
// declare module "next-auth" {
//   interface Session {
//     user: {
//       role?: string | null; // Add the 'role' property to the session user object
//     } & DefaultSession["user"];
//   }

//   interface User extends DefaultUser {
//     role?: string | null; // Add the 'role' property to the user object
//   }
// }

// // Extend the built-in JWT type
// declare module "next-auth/jwt" {
//   interface JWT {
//     role?: string | null; // Add the 'role' property to the JWT token
//   }
// }

// types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and `auth`
   */
  interface Session {
    user: {
      /** The user's unique ID. */
      id: string;
      /** The user's role. */
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback.
   */
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
  }
}
