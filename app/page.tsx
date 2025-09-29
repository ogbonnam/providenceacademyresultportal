// import React from "react";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth-options";
// import Login from "@/components/Login";
// import LogoutButton from "@/components/LogoutButton";
// import ClientWrapper from "@/components/ClientWrapper";

// export default async function HomePage() {
//   // Fetch the session data directly on the server
//   const session = await getServerSession(authOptions);

//   return (
//     <>
//       <nav className="bg-white shadow-md p-4 flex justify-between items-center rounded-b-lg">
//         <h1 className="text-2xl font-bold text-indigo-700">
//           Sixth Form Foundation
//         </h1>
//         {session && session.user && (
//           <div className="flex items-center space-x-4">
//             <span className="text-gray-700 font-medium capitalize">
//               Welcome, {session.user.name} ({session.user.role})!
//             </span>
//             <LogoutButton />
//           </div>
//         )}
//       </nav>
// fggdn
//       <main className="container mx-auto p-6">
//         {!session ? (
//           <Login />
//         ) : (
//           // Pass the server-fetched session data to the ClientWrapper
//           // The ClientWrapper will handle the SessionContext.Provider
//           <ClientWrapper session={session} />
//         )}
//       </main>
//     </>
//   );
// }

// app/page.tsx
import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import Login from "@/components/Login";
import LogoutButton from "@/components/LogoutButton";
import ClientWrapper from "@/components/ClientWrapper";
import BackgroundCarousel from "@/components/BackgroundCarousel";

export default async function HomePage() {
  // Fetch the session data directly on the server
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen relative">
      {/* Background Carousel - only show when user is not logged in */}
      {!session && <BackgroundCarousel />}

      <nav className="bg-white/90 backdrop-blur-sm shadow-md p-4 flex justify-between items-center rounded-b-lg relative z-10">
     <div className="flex items-center justify-center">
  <img 
    src="/images/logo.jpg" 
    alt="Logo" 
    className="mb-4 w-16 h-16" 
  />
  <h1 className="text-2xl font-bold text-indigo-700 text-center">
    Providence British Academy
  </h1>
</div>

        {session && session.user && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium capitalize">
              Welcome, {session.user.name} ({session.user.role})!
            </span>
            <LogoutButton />
          </div>
        )}
      </nav>

      <main className="container mx-auto p-6 relative z-10">
        {!session ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
            <Login />
          </div>
        ) : (
          // Pass the server-fetched session data to the ClientWrapper
          // The ClientWrapper will handle the SessionContext.Provider
          <ClientWrapper session={session} />
        )}
      </main>
    </div>
  );
}
