//@ts-ignore
import "./globals.css";
import NavBar from "./components/NavBar/NavBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lancaster AI-ChatBot Project",
  description: "Project to aid students in their organization of events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="container py-4">{children}</main>
      </body>
    </html>
  );
}
