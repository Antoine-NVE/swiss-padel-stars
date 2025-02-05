import React from "react";

export default function Page() {
    return (
        <div className="grow bg-dark-primary">
            <header id="hero" className="relative">
                <img src="/build/images/hero-home.png" alt="" className="object-cover w-screen" />
                <h1 className="absolute top-1/2 right-1/2 text-secondary text-6xl font-bold translate-x-[50%] -translate-y-[50%]">
                    Swiss Padel Stars
                </h1>
            </header>
            <p>Welcome to the home page of this simple React app.</p>
        </div>
    );
}
