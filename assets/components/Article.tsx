import React from "react";
import { type ImgProps } from "../types";
import { cn } from "../utils";

/**
 * ui components
 */
type ArticleProps = {
    img: ImgProps | ImgProps[];
    title?: string;
    description?: string;
    btn?: React.ReactNode;
    subTitle?: string;
    direction?: "rtl" | "ltr";
    children?: React.ReactNode;
};

/**
 * Un article est un element indépendant image + texte + bouton
 * la propriété direction permet de spécifier l'ordre de présentation
 */
export const Article = ({ img, btn, description, subTitle, title, direction, children }: ArticleProps) => {
    if (Array.isArray(img) && img.length > 2) {
        throw new Error("More than 2 images is not implemented yet !");
    }

    if (subTitle && !title) {
        throw new Error("Un sous-titre dois toujours avoir un titre !");
    }

    return (
        <article
            className={cn(
                /* .wrapper est initialisé à la volée */
                "flex center justify-around [&_.wrapper]:w-[500px]",
                direction === "ltr" && "flex-row-reverse"
            )}>
            <div className="wrapper">
                <ArticleImage img={img} />
            </div>
            <div className="wrapper flex flex-col items-center justify-around">
                {subTitle ? (
                    /* si un sous-titre est fourni */
                    <div className="flex flex-col justify-start items-center gap-2 text-left w-full">
                        <h3 className="w-full text-secondary text-4xl font-semibold">{title}</h3>
                        <p className="w-full text-white">{subTitle}</p>
                    </div>
                ) : (
                    /* pas de sous-titre fourni */
                    <h3 className="w-full text-secondary text-4xl font-semibold text-left">{title}</h3>
                )}
                {description && (
                    /* Si une description est fourni */
                    <p className="w-full text-white text-3xl text-balance text-justify">{description}</p>
                )}
                {btn && /* Si un texte de bouton est fourni */ btn}
                {children}
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
