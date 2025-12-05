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
              <SidebarInset>
                <header className="flex shrink-0 items-center gap-2 pb-8">
                  {/* <SidebarTrigger /> */}
                  {/* <Separator
                    orientation="vertical"
                    className="data-[orientation=vertical]:h-4"
                  /> */}
                  <h1 className="font-bold text-4xl">Adopters</h1>
                </header>
                <div className="">{children}</div>
              </SidebarInset>
            </DashboardWrapper>
          </QueryClientProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
