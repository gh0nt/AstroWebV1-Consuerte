import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Consuerte App",
  description: "Consuerte App, Construyendo Sueños",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
            <div className="flex-1 w-full flex flex-col gap-4 items-center rounded">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold p-2">
                    <Link href={"/protected/panel"}>
                      <img
                        src={"/img/logoconsuerte.svg"}
                        alt={"Consuerte"}
                        className="max-w-40 object-contain rounded-xl"
                      />
                    </Link>
                  </div>
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
                <div className="py-3"></div>
              </nav>

              {children}
              <ToastContainer position="top-right" autoClose={5000} />
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
