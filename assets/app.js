//@ts-check
import Home from "./pages/index.tsx";
import About from "./pages/about.tsx";
import Layout from "./layout.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import "./styles/app.css";
import React from "react";
import { createRoot } from "react-dom/client";

const links = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "About",
        href: "/about",
    },
    {
        label: "Contact",
        href: "/contact",
    },
];

const rootElement = document.getElementById("root");
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <BrowserRouter>
            <Routes>
                {links.map((link) => (
                    <Route
                        path={link.href}
                        element={
                            <Layout links={links}>
                                <Home />
                            </Layout>
                        }></Route>
                ))}
            </Routes>
        </BrowserRouter>
    );
}
