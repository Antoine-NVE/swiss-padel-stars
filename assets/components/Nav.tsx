import React from "react";
import type { NavLink } from "../types";

export default function Nav({ links }: { links: NavLink[] }) {
    return (
        <nav>
            <ul>
                {links.map((link) => (
                    <li key={link.href}>
                        <a href={link.href}>{link.label}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
