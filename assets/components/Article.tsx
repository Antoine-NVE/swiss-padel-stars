import React from "react";
import { Button as RadixButton } from "../components/ui/button";
import { type ImgProps } from "../types";
import { cn } from "../utils";

/**
 * ui components
 */
type ArticleProps = {
    img: ImgProps | ImgProps[];
    text: string;
    direction?: "rtl" | "ltr";
    btnText?: string;
};

/**
 * Un article est un element indépendant image + texte + bouton
 * la propriété direction permet de spécifier l'ordre de présentation
 */
export const Article = ({ img, text, direction, btnText }: ArticleProps) => {
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
                {btnText && <Button className="w-fit">{btnText}</Button>}
            </div>
        </article>
    );
};

/**
 * S'il y a deux images, elles sont affichées chevauchante comme le spécifie le figma
 * sinon, une seule image est affichée
 */
export const ArticleImage = ({ img }: { img: ImgProps | ImgProps[] }) => {
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
