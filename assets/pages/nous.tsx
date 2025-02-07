import React from "react";
import { Article } from "../components/Article";
import CommunFaq from "../components/CommunFaq";
import { Hero } from "../components/Hero";
import { type ImgProps } from "../types";

export default function Page() {
    // articles à afficher
    const articles: { img: ImgProps | ImgProps[]; text: string; btnText?: string }[] = [
        {
            img: { src: "build/images/nous-body-img-2.png", alt: "", width: 500, height: 400 },
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        },
        {
            img: { src: "build/images/nous-body-img-1.png", alt: "", width: 500, height: 400 },
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        },
    ];

    return (
        <div className="grow bg-dark-primary space-y-10">
            <Hero title="Qui sommes-nous" img={{ src: "/build/images/hero-nous.png", alt: "banniere" }} />
            <section className="space-y-10 w-full">
                {articles.map((article, index) => {
                    const dir = index % 2 === 0 ? "ltr" : "rtl"; // présentation de gauche à droite ou de droite à gauche
                    return (
                        <Article
                            direction={dir}
                            key={index}
                            img={article.img}
                            text={article.text}
                            btnText={article.btnText}
                        />
                    );
                })}
            </section>
            <section className="relative">
                <img src="build/images/nous-body-split-big.png" alt="" className="object-cover w-screen" height={450} />
                <div className="absolute inset-0 flex items-center justify-around gap-10">
                    <img
                        src="build/images/nous-body-split-small.png"
                        alt=""
                        className="h-[80%] object-cover rounded-lg"
                    />
                    <p className="text-white text-3xl text-balance text-justify max-w-[40%]">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore perspiciatis magnam beatae
                        deserunt voluptate reprehenderit ea reiciendis laudantium dolorum. Lorem ipsum, dolor sit amet
                        consectetur adipisicing elit.
                    </p>
                </div>
            </section>
            <CommunFaq />
        </div>
    );
}
