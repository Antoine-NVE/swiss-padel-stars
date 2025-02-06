import React from "react";
import { cn } from "../utils";

export default function Logo({ className }: { className?: string }) {
    return (
        <a href="/" aria-label="go to main page">
            <img src={"/build/images/logo.png"} alt="Swiss Padel Stars logo" className={cn("h-10", className)} />
        </a>
    );
}
