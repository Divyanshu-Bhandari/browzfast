import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";

// ✅ Optimize Font Loading
const font = Open_Sans({ 
  subsets: ["latin"], 
  display: "swap",  // Ensures text is visible even before font loads
  weight: ["400", "700"], // Load only necessary weights
  preload: true, // Preload to improve LCP
});

export const metadata: Metadata = {
  title: "BrowzFast",
  description:
    "BrowzFast: A fast and intuitive browsing experience with seamless navigation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#202020]")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            storageKey="home-launch-pad-theme"
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <SpeedInsights />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
