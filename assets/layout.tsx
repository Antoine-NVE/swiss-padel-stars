import React from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { NavLink } from "./types";

export default function Layout({ children, links }: { children: React.ReactNode; links: NavLink[] }) {
    return (
        <>
            <Header links={links} />
            <main className="relative w-screen flex flex-col min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
