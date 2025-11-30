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
  description: "Real-time chat and file sharing app",
    icons: {
    icon: "https://res.cloudinary.com/doql04ndg/image/upload/v1764501865/646f45f7-4d4c-4d62-99bd-2b5384ef22f2_cqdrbt.png",
  }
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
