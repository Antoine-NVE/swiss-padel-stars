//@ts-check
import Accueil from "./pages/index.tsx";
import Nous from "./pages/nous.tsx";
import Contact from "./pages/contact.tsx";
import Infrastructure from "./pages/infrastructure.tsx";
import Partenariat from "./pages/partenariat.tsx";
import Produits from "./pages/produits.tsx";
import Layout from "./layout.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import "./styles/app.css";
import React from "react";
import { createRoot } from "react-dom/client";
import Nav from "./components/Nav.tsx";

const links = [
    {
        label: "Accueil",
        href: "/",
        component: Accueil,
    },
    {
        label: "Qui sommes-nous",
        href: "/nous",
        component: Nous,
    },
    {
        label: "Contact",
        href: "/contact",
        component: Contact,
    },
    {
        label: "Infrastructure",
        href: "/infrastructure",
        component: Infrastructure,
    },
    {
        label: "Partenariat et sponsoring",
        href: "/partenariat",
        component: Partenariat,
    },
    {
        label: "Produits",
        href: "/produits",
        component: Produits,
    },
];

const rootElement = document.getElementById("root");
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    {links.map((link) => (
                        <Route
                            key={link.label}
                            path={link.href}
                            element={
                                <Layout>
                                    <header className="absolute flex items-center justify-around w-screen bg-primary/90 py-4 px-4 z-50">
                                        <Nav links={links} />
                                    </header>
                                    <link.component />
                                </Layout>
                            }
                        />
                    ))}
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    );
}
