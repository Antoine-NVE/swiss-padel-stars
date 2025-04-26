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
import Profile from "./pages/profile.tsx"
import ScrollToTop from "./components/ScrollToTop.tsx";

/**
 * intra-website navigation
 * @type {{label : string ; href: string ; available : boolean ; Page: () => React.JSX.Element; navbar: boolean}[]}
 */
const links = [
    {
        label: "Accueil",
        href: "/", // chemin du routeur client
        Page: Accueil, // rendu
        available: true,
        navbar: true, // affiché dans la navbar
    },
    {
        label: "Qui sommes-nous",
        href: "nous",
        Page: Nous,
        available: true,
        navbar: true,
    },
    {
        label: "Contact",
        href: "contact",
        Page: Contact,
        available: true,
        navbar: false,
    },
    {
        label: "Infrastructure",
        href: "infrastructure",
        Page: Infrastructure,
        available: true,
        navbar: true,
    },
    {
        label: "Partenariat et sponsoring",
        href: "partenariat",
        Page: Partenariat,
        available: true,
        navbar: true,
    },
    {
        label: "Produits",
        href: "produits",
        Page: Produits,
        available: false,
        navbar: true,
    },
    {
        label: "Profil",
        href: "profil",
        Page: Profile,
        available: true,
        navbar: false,
    },
];

const rootElement = document.getElementById("root");
if (rootElement) {
    const root = createRoot(rootElement);

    root.render(
        <React.StrictMode>
            <BrowserRouter>
            <ScrollToTop />
                <Routes>
                    <Route 
                        element={
                            <Layout links={links} />
                        }>
                        {links.map(({ Page, href, label, available }) =>
                         available ? <Route key={label} path={href === "/" ? "/" : `${href}`} element={<Page />} /> : null
                        )}
                    </Route>
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    );
}
