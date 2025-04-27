import React from "react";
import { cn } from "../utils";
import { NavLink } from "react-router-dom";

export default function Logo({ className }: { className?: string }) {
    return (
        <NavLink to="/" aria-label="go to main page" className={cn(className)}>
            <img src={"/build/images/logo.png"} alt="Swiss Padel Stars logo" className={"h-12 md:h-16"} />
        </NavLink>
    );
}
