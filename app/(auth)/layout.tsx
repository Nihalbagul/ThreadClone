import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads Application",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children}: {
    children:React.ReactNode
}) {

    return (<ClerkProvider>
        <html lang="en">
            <body className={`${inter.className} bg-dark-1`}>
                <div className="w-full flex justify-center min-h-screen">
                {children}
                </div>
               
            </body>
        </html>
    </ClerkProvider>
    )
}

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex items-center justify-center h-screen bg-dark-1">
//       {children}
//     </div>
//   );
// }
