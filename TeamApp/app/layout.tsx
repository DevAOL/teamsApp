import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import NavBar from "./Components/navBar";
import ContextProvider from "./Providers/contextProvider";  
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const nunito = Nunito({ 
  weight: ["400", "500", "600", "700", "800" ],
  subsets: ["latin"] 
});

export const metadata: Metadata = {
  title: "Team App",
  description: "Team App for SAS Ladies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
        integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" 
        crossOrigin="anonymous" 
        referrerPolicy="no-referrer" />
        </head>
        <body className={nunito.className}>
        <NextTopLoader 
          height={2}
          color="#27AE60"
          easing="cubic-bezier(0.53,0.21,0,1)"
        />
        <ContextProvider>
            <div className="globalStyle">
              <NavBar />
              <div className="w-full container scroll">{children}</div>
            </div>
        </ContextProvider>
      </body>
    </html>
    );
}
