import React from "react";
import Nav from "./components/Nav";
import type { NavLink } from "./types";

export default function Layout({ children, links }: { children: React.ReactNode; links: NavLink[] }) {
    return (
        <main>
            <header>
                <Nav links={links} />
            </header>
            {children}
            <footer>footer</footer>
        </main>
    );
}
