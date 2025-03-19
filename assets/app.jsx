//@ts-check
import Accueil from "./pages/index.tsx";
import Nous from "./pages/nous.tsx";
import Contact from "./pages/contact.tsx";
import Infrastructure from "./pages/infrastructure.tsx";
import Partenariat from "./pages/partenariat.tsx";
import Produits from "./pages/produits.tsx";
import Layout from "./layout.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/app.css";
import React from "react";
import { createRoot } from "react-dom/client";


/**
 * intra-website navigation
 * @type {{label : string ; href: string ; available : boolean ; Page: () => React.JSX.Element;}[]}
 */
const links = [
    {
        label: "Accueil",
        href: "/", // chemin du routeur client
        Page: Accueil, // rendu
        available: true,
    },
    {
        label: "Qui sommes-nous",
        href: "nous",
        Page: Nous,
        available: true,
    },
    {
        label: "Contact",
        href: "contact",
        Page: Contact,
        available: true,
    },
    {
        label: "Infrastructure",
        href: "infrastructure",
        Page: Infrastructure,
        available: true,
    },
    {
        label: "Partenariat et sponsoring",
        href: "partenariat",
        Page: Partenariat,
        available: true,
    },
    {
        label: "Produits",
        href: "produits",
        Page: Produits,
        available: true,
    },
];

const rootElement = document.getElementById("root");
if (rootElement) {
    const root = createRoot(rootElement);

    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route 
                        element={
                            <Layout links={links} />
                        }>
                        {links.map(({ Page, href, label, available }) =>
                         available ? <Route key={label} path={href === "/" ? "/" : `${href}`} element={<Page />} /> : null
                        )}
                        <Route path="test" element={<h1>Test Page</h1>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    );
}
