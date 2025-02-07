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
/**
 * intra-website navigation
 * @type {{label : string ; href: string ; Page: () => React.JSX.Element;}[]}
 */
const links = [
    {
        label: "Accueil",
        href: "/", // chemin du routeur client
        Page: Accueil, // rendu
    },
    {
        label: "Qui sommes-nous",
        href: "/nous",
        Page: Nous,
    },
    {
        label: "Contact",
        href: "/contact",
        Page: Contact,
    },
    {
        label: "Infrastructure",
        href: "/infrastructure",
        Page: Infrastructure,
    },
    {
        label: "Partenariat et sponsoring",
        href: "/partenariat",
        Page: Partenariat,
    },
    {
        label: "Produits",
        href: "/produits",
        Page: Produits,
    },
];

const rootElement = document.getElementById("root");
if (rootElement) {
    const root = createRoot(rootElement);

    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    {links.map((link) => {
                        /**
                         * Layout contient le Header et le Footer
                         *
                         * ```tsx
                         *
                         * <>
                         *   <Header links={links} />
                         *   <main className="relative w-screen flex flex-col min-h-screen">
                         *      {children}
                         *   </main>
                         *   <Footer />
                         * </>
                         *
                         * ```
                         */
                        const { Page, href, label } = link;
                        return (
                            <Route
                                key={label}
                                path={href}
                                element={
                                    <Layout links={links}>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    );
}
