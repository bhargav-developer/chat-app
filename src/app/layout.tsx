import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// import { Poppins } from 'next/font/google';
import { Toaster } from "react-hot-toast";

// const poppins = Poppins({
//   weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
//   subsets: ['latin'],
//   display: 'swap',
// });

export const metadata: Metadata = {
  title: "Chat Sync",
  description: "Real-time chat and file sharing web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={poppins.className}
      >
        <Toaster/>
        {children}
      </body>
    </html>
  );
}
