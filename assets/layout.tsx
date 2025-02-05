import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="w-screen flex flex-col min-h-screen">
            {children}
            <footer>footer</footer>
        </main>
    );
}
