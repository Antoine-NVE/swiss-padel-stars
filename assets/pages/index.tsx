import React from "react";
import { Article } from "../components/Article";
import CommunFaq from "../components/CommunFaq";
import { Hero } from "../components/Hero";
import { Button } from "../components/ui/button";
import { type ImgProps } from "../types";

const articles: { img: ImgProps | ImgProps[]; text: string; btnText: string }[] = [
    {
        img: { src: "build/images/index/body-1.png", alt: "", width: 500, height: 400 },
        text: "Swiss Padel Stars accompagne les entreprises, les clubs et les collectivités dans le développement du padel en Suisse romande – de l'implantation d'infrastructures à l'organisation d'événements, en passant par le conseil en sponsoring et en logistique.",
        btnText: "GHOST",
    },
    {
        img: { src: "build/images/index/body-2.png", alt: "", width: 500, height: 400 },
        text: "Accessible, moderne et en forte croissance, le padel offre des opportunités de sponsoring uniques, avec une audience engagée et encore loin des tarifs prohibitifs du tennis ou des sports automobiles. Nous aidons marques, clubs et institutions à s'emparer de cet engouement",
        btnText: "CONTACT",
    },
    {
        img: [
            { src: "build/images/index/body-grid-1.png", alt: "", width: 220, height: 220 }, //
            { src: "build/images/index/body-grid-2.png", alt: "", width: 220, height: 220 }, //
        ],
        text: "Swiss Padel Stars est né d'une conviction simple : le padel n'est pas qu'un sport en plein essor, c'est un formidable terrain d'opportunités. Pour créer des expériences, des partenariats et des lieux de vie uniques, vous voulez construire un terrain?",
        btnText: "DEMANDEZ VOTRE DEVIS",
    },
];

export default function Page() {
    return (
        <>
            <Hero title="Swiss Padel Stars" img={{ src: "/build/images/index/hero.png", alt: "banniere de la page" }} />
            <section className="space-y-10 w-full">
                {articles.map((article, index) => {
                    // présentation de gauche à droite ou de droite à gauche
                    const dir = index % 2 === 0 ? "rtl" : "ltr";
                    return (
                        <Article
                            direction={dir}
                            key={index}
                            img={article.img}
                            description={article.text}
                            btn={<Button>{article.btnText}</Button>}
                        />
                    );
                })}
            </section>
            <CommunFaq />
        </>
    );
}