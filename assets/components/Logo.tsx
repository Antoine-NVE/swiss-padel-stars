import React from "react";

export default function Logo({ src }: { src: string }) {
    return (
        <a href="/" aria-label="go to main page">
            <img src={src} alt="Swiss Padel Stars logo" className="h-10 translate-x-[100%]" />
        </a>
    );
}
