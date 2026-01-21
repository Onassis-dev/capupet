"use client";

import "../globals.css";
import { queryClient } from "@/lib/query";
import { QueryClientProvider } from "@tanstack/react-query";
import { DashboardWrapper } from "./providers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Manrope } from "next/font/google";
import { Toaster } from "sonner";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={manrope.className}>
        <SidebarProvider>
          <QueryClientProvider client={queryClient}>
            <Toaster />
            <DashboardWrapper>
              <AppSidebar />
              <SidebarInset>{children}</SidebarInset>
            </DashboardWrapper>
          </QueryClientProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
