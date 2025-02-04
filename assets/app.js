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
];

const rootElement = document.getElementById("root");
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Layout links={links}>
                            <Home />
                        </Layout>
                    }></Route>
                <Route
                    path="/about"
                    element={
                        <Layout links={links}>
                            <About />
                        </Layout>
                    }></Route>
            </Routes>
        </BrowserRouter>
    );
}
