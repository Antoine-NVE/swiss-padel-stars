import React from "react";
import { Button as RadixButton } from "../components/ui/button";
import { type ImgProps } from "../types";
import { cn } from "../utils";

const Article = ({ img, text, direction }: { img: ImgProps; text: string; direction: "rtl" | "ltr" }) => {
    return (
        <article className="flex center justify-around [&_.wrapper]:w-[500px]">
            <div className="wrapper">
                <img src={img.src} alt={img.alt} width={500} height={400} className="object-cover rounded-lg" />
            </div>
            <div className="wrapper flex flex-col items-center justify-around">
                <p className="text-white text-3xl text-balance text-justify">{text}</p>
                <Button className="w-fit">Ghost</Button>
            </div>
        </article>
    );
};

const Hero = () => {
    return (
        <div className="relative">
            <img src="/build/images/hero-home.png" alt="" className="object-cover w-screen" />
            <h1 className="absolute top-1/2 right-1/2 text-secondary text-6xl font-bold translate-x-[50%] -translate-y-[50%]">
                Swiss Padel Stars
            </h1>
        </div>
    );
};

export default function Page() {
    const articles: { img: ImgProps; text: string }[] = [
        {
            img: { src: "build/images/body-img-home-1.png", alt: "" },
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        },
        {
            img: { src: "build/images/body-img-home-2.png", alt: "" },
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        },
    ];

    return (
        <div className="grow bg-dark-primary space-y-10">
            <Hero />
            <section className="space-y-10 w-full">
                {articles.map((article, index) => {
                    const dir = index % 2 === 0 ? "rtl" : "ltr";
                    return <Article direction={dir} key={index} img={article.img} text={article.text} />;
                })}
            </section>
        </div>
    );
}

/**
 * ui components
 */
const Button = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <RadixButton
            className={cn("bg-dark-secondary text-white py-2 px-4 rounded-3xl w-fit border", className)}
            onClick={console.log}>
            {children}
        </RadixButton>
    );
};
