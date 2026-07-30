import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout({ children }) {
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>);

}