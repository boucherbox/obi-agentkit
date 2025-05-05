import type { Metadata } from "next";
import "./globals.css";
import { ActionProvider } from "./contexts/ActionContext";
import { Oi, Atma } from "next/font/google";

const oi = Oi({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const atma = Atma({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

/**
 * Metadata for the page
 */
export const metadata: Metadata = {
  title: "Obi",
  description: "Obi - Your AI Assistant",
};

/**
 * Root layout for the page
 *
 * @param {object} props - The props for the root layout
 * @param {React.ReactNode} props.children - The children for the root layout
 * @returns {React.ReactNode} The root layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${atma.className} bg-gray-100 dark:bg-gray-900 dark flex flex-col min-h-screen bg-[url('/background_image.svg')] bg-cover bg-center bg-no-repeat bg-fixed`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <ActionProvider>
          {/* Header (Fixed Height) */}
          <header className="pt-16 pb-6 flex items-center justify-center relative z-10">
            <span className={`${oi.className} text-6xl md:text-8xl font-bold text-[#987048]`}>
              Obi
            </span>
          </header>

          {/* Main Content (Dynamic, Grows but Doesn't Force Scroll) */}
          <main className="flex-grow flex items-center justify-center px-4 relative z-10">{children}</main>
        </ActionProvider>
      </body>
    </html>
  );
}
