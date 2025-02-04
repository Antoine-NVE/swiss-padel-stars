import React from "react";
import Nav from "./components/Nav";
import type { NavLink } from "./types";

export default function Layout({ children, links }: { children: React.ReactNode; links: NavLink[] }) {
    return (
        <main className="w-screen flex flex-col min-h-screen">
            <header className="flex items-center justify-around w-screen bg-primary py-4 px-2">
                <Nav links={links} />
            </header>
            {children}
            <footer>footer</footer>
        </main>
    );
}
