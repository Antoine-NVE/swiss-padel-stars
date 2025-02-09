import React from "react";
import { Article } from "../components/Article";
import CommunFaq from "../components/CommunFaq";
import { Hero } from "../components/Hero";
import Split from "../components/Split";
import TestimonyCarousel from "../components/Testimony";
import { Button } from "../components/ui/button";
import { ImgProps } from "../types";

type ProduitArticleProps = {
    img: ImgProps | ImgProps[];
    description: string;
    btnText: string;
    titleText: string;
    subTitle?: string;
};

const articles: ProduitArticleProps[] = [
    {
        img: { src: "build/images/produits/body-1.png", alt: "", width: 500, height: 400 },
        titleText: "Table de padel",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        btnText: "Demander un devis",
    },
    {
        img: { src: "build/images/header/balles.png", alt: "", width: 500, height: 400 },
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        btnText: "Commander",
        titleText: "Balles de padel",
        subTitle: "30.00 CH",
    },
    {
        img: { src: "build/images/header/raquette.png", alt: "", width: 500, height: 400 },
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        btnText: "Commander",
        titleText: "Raquette de padel",
        subTitle: "60.00 CH",
    },
];

export default function Page() {
    return (
        <div className="grow bg-dark-primary space-y-10">
            <Hero title="Produits" img={{ src: "/build/images/produits/hero.png", alt: "banniere" }} />
            <section className="space-y-10 w-full">
                {articles.map((article, index) => {
                    // présentation de gauche à droite ou de droite à gauche
                    return (
                        <Article
                            direction={"rtl"}
                            key={index}
                            img={article.img}
                            text={{
                                description: article.description,
                                btn: article.btnText,
                                title: article.titleText,
                                subTitle: article.subTitle,
                            }}
                        />
                    );
                })}
            </section>
            <Split bgImg={{ src: "build/images/partenariat/body-split-xl.png", alt: "" }}>
                <div className="flex flex-col items-center text-balance text-center max-w-[40%] gap-10">
                    <h3 className="text-secondary text-6xl font-semibold">Partenariat & Sponsoring</h3>
                    <Button className="border">Contact</Button>
                </div>
                <p className="text-white text-3xl text-balance text-justify max-w-[40%]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore perspiciatis magnam beatae deserunt
                    voluptate reprehenderit ea reiciendis laudantium dolorum. Lorem ipsum, dolor sit amet consectetur
                    adipisicing elit.
                </p>
            </Split>
            <TestimonyCarousel />
            <CommunFaq />
        </div>
    );
}
