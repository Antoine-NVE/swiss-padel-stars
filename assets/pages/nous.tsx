import React from "react";
import { Article } from "../components/Article";
import CommunFaq from "../components/CommunFaq";
import { Hero } from "../components/Hero";
import Split from "../components/Split";
import { Button } from "../components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { type ImgProps } from "../types";

const articles: { img: ImgProps | ImgProps[]; text: string; btnText?: string }[] = [
    {
        img: { src: "build/images/nous/body-2.png", alt: "", width: 500, height: 400 },
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        btnText: "button",
    },
    {
        img: { src: "build/images/nous/body-1.png", alt: "", width: 500, height: 400 },
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        btnText: "button",
    },
];

const carousel = [
    {
        img: {
            src: "build/images/nous/carousel-1.png",
            alt: "evenement 1 from the carousel",
            width: 325,
            height: 325,
        },
        link: "/",
        label: "Evenement 1",
        description: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        ],
    },
    {
        img: {
            src: "build/images/nous/carousel-2.png",
            alt: "evenement 2 from the carousel",
            width: 325,
            height: 325,
        },
        link: "/",
        label: "Evenement 2",
        description: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        ],
    },
    {
        img: {
            src: "build/images/nous/carousel-3.png",
            alt: "evenement 3 from the carousel",
            width: 325,
            height: 325,
        },
        link: "/",
        label: "Evenement 3",
        description: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        ],
    },
];

const splitImgs = {
    sm: { src: "build/images/nous/body-split-sm.png", alt: "" },
    bg: { src: "build/images/nous/body-split-xl.png", alt: "" },
};
export default function Page() {
    return (
        <div className="grow bg-dark-primary space-y-10">
            <Hero title="Qui sommes-nous" img={{ src: "/build/images/nous/hero.png", alt: "banniere" }} />
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
            <Split smImg={splitImgs.sm} bgImg={splitImgs.bg} direction="ltr">
                <p className="text-white text-3xl text-balance text-justify max-w-[40%]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore perspiciatis magnam beatae deserunt
                    voluptate reprehenderit ea reiciendis laudantium dolorum. Lorem ipsum, dolor sit amet consectetur
                    adipisicing elit.
                </p>
            </Split>
            <section className="flex flex-col items-center justify-center gap-10">
                <h3 className="text-3xl text-secondary font-semibold">Evenement Blog</h3>
                <Carousel opts={{ align: "start", loop: true, startIndex: 1 }} className="max-w-5xl">
                    <CarouselContent>
                        {
                            /* on loop bêtement 2 fois sur carousel pour avoir plus d'élément */ [1, 2].map(() =>
                                carousel.map((item, index) => (
                                    <CarouselItem
                                        key={index}
                                        /* basis-1/x => x images visibles */
                                        className="basis-1/3 flex flex-col items-center justify-center gap-5">
                                        <img src={item.img.src} alt={item.img.alt} width={325} />
                                        <Dialog>
                                            <DialogTrigger className="text-white text-3xl hover:underline">
                                                {item.label}
                                            </DialogTrigger>
                                            <DialogContent className="bg-grey text-white overflow-y-scroll">
                                                <div className="flex flex-col items-center justify-center gap-5">
                                                    <img src={item.img.src} alt={item.img.alt} className="w-8/12" />
                                                    <DialogTitle className="text-secondary text-2xl">
                                                        {item.label}
                                                    </DialogTitle>
                                                    {item.description.map((desc, index) => (
                                                        <DialogDescription
                                                            key={index}
                                                            className="text-white text-justify">
                                                            {desc}
                                                        </DialogDescription>
                                                    ))}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </CarouselItem>
                                ))
                            )
                        }
                    </CarouselContent>
                    <CarouselPrevious className="translate-x-[100%] -translate-y-[100%]" />
                    <CarouselNext className="-translate-x-[100%] -translate-y-[100%]" />
                </Carousel>
            </section>
            <CommunFaq />
        </div>
    );
}
