import React from "react";
import CommunFaq from "../components/CommunFaq";
import { Hero } from "../components/Hero";

export default function Page() {
    return (
        <div className="grow bg-dark-primary space-y-10">
            <Hero title="Formulaire de contact" img={{ src: "/build/images/hero-contact.png", alt: "banniere" }} />
            <section className="space-y-10 w-full"></section>
            <CommunFaq />
        </div>
    );
}
