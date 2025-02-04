import { MenuIcon, PersonStanding, ShoppingBasket } from "lucide-react";
import React from "react";
import type { NavLink } from "../types";

export default function Nav({ links }: { links: NavLink[] }) {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <nav className="w-full flex justify-between items-center">
            {/* NAV  */}
            <button aria-label="open menu" className="text-white" onClick={() => setIsOpen((p) => !p)}>
                <MenuIcon className="text-secondary" size={38} />
                <span className="sr-only">open menu</span>
            </button>
            {isOpen && (
                <ul className="flex flex-col gap-5">
                    {links.map((link) => (
                        <li key={link.href} className="py-2 px-3 hover:[&>a]:hover:underline">
                            <a href={link.href}>{link.label}</a>
                        </li>
                    ))}
                </ul>
            )}
            {/* spacer */}
            <div className="grow"></div>
            {/* LOGO */}
            <a href="/" className="py-2 px-3">
                <img src="/build/images/logo.png" alt="Swiss Padel Stars" className="h-10" />
            </a>
            {/* spacer */}
            <div className="grow"></div>
            {/* PROFILE */}
            <div className="inline-flex items-center gap-3">
                <a href="/profile" className="hover:underline">
                    <PersonStanding className="text-secondary" size={38} />
                </a>
                <button onClick={() => console.log("basket handler")}>
                    <ShoppingBasket className="text-secondary" size={38} />
                </button>
                <a href="/contact">
                    <button className="bg-dark-secondary text-white py-2 px-3 rounded-3xl">Contact</button>
                </a>
            </div>
        </nav>
    );
}

// menu burger space logo space profile basket btn-contact
