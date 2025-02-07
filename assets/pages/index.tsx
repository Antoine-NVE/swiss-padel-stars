import React from "react";
import CommunFaq from "../components/CommunFaq";
import { Hero } from "../components/Hero";
import { Button as RadixButton } from "../components/ui/button";
import { type ImgProps } from "../types";
import { cn } from "../utils";

export default function Page() {
    // articles à afficher
    const articles: { img: ImgProps | ImgProps[]; text: string; btnText: string }[] = [
        {
            img: { src: "build/images/body-img-home-1.png", alt: "", width: 500, height: 400 },
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
            btnText: "Ghost",
        },
        {
            img: { src: "build/images/body-img-home-2.png", alt: "", width: 500, height: 400 },
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
            btnText: "Contact",
        },
        {
            img: [
                { src: "build/images/body-img-home-small-1.png", alt: "", width: 220, height: 220 }, //
                { src: "build/images/body-img-home-small-2.png", alt: "", width: 220, height: 220 }, //
            ],
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
            btnText: "Commander un devis",
        },
    ];

    return (
        <div className="grow bg-dark-primary space-y-10">
            <Hero title="Swiss Padel Stars" img={{ src: "/build/images/hero-home.png", alt: "banniere" }} />
            {/* MAIN CONTENT */}
            {/* MAIN CONTENT */}
            {/* MAIN CONTENT */}
            {/* MAIN CONTENT */}
            <section className="space-y-10 w-full">
                {articles.map((article, index) => {
                    // présentation de gauche à droite ou de droite à gauche
                    const dir = index % 2 === 0 ? "rtl" : "ltr";
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

            {/* FAQ */}
            {/* FAQ */}
            {/* FAQ */}
            {/* FAQ */}
            <CommunFaq />
        </div>
    );
}

/**
 * ui components
 */
type ArticleProps = {
    img: ImgProps | ImgProps[];
    text: string;
    direction?: "rtl" | "ltr";
    btnText: string;
};

/**
 * Un article est un element indépendant image + texte + bouton
 * la propriété direction permet de spécifier l'ordre de présentation
 */
const Article = ({ img, text, direction, btnText }: ArticleProps) => {
    if (Array.isArray(img) && img.length > 2) {
        throw new Error("More than 2 images is not implemented yet !");
    }

    return (
        <article
            className={cn(
                "flex center justify-around [&_.wrapper]:w-[500px]",
                direction === "ltr" && "flex-row-reverse"
            )}>
            <div className="wrapper">
                <ArticleImage img={img} />
            </div>
            <div className="wrapper flex flex-col items-center justify-around">
                <p className="text-white text-3xl text-balance text-justify">{text}</p>
                <Button className="w-fit">{btnText}</Button>
            </div>
        </article>
    );
};

/**
 * S'il y a deux images, elles sont affichées chevauchante comme le spécifie le figma
 * sinon, une seule image est affichée
 */
const ArticleImage = ({ img }: { img: ImgProps | ImgProps[] }) => {
    if (Array.isArray(img)) {
        if (img.length > 2) throw new Error("More than 2 images is not implemented yet!");

        return (
            <div className="relative" style={{ height: img[0].height * 2 + "px" }}>
                <div className="absolute top-10 right-16 z-0">
                    <img {...img[0]} className="aspect-square object-cover rounded-xl" />
                </div>
                <div className="absolute bottom-10 left-16 z-10 ring-[10px] ring-dark-primary rounded-xl">
                    <img {...img[1]} className="aspect-square object-cover rounded-xl" />
                </div>
            </div>
        );
    }

    return <img {...img} className="object-cover rounded-xl" />;
};

const Button = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <RadixButton
            className={cn("bg-dark-secondary text-white py-2 px-4 rounded-3xl w-fit border", className)}
            onClick={console.log}>
            {children}
        </RadixButton>
    );
};
