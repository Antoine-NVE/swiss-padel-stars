import React from "react";
import { NavLink } from "../types";
import Nav from "./Nav";
export default function Header({ links }: { links: NavLink[] }) {
    return (
        <header className="absolute flex items-center justify-around w-screen bg-primary/90 py-4 px-4 z-50">
            <Nav links={links} />
        </header>
    );
}
