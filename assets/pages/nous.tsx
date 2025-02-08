import React from "react";
import { Article } from "../components/Article";
import CommunFaq from "../components/CommunFaq";
import { Hero } from "../components/Hero";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../components/ui/dialog";
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

    const carousel = [
        {
            img: { src: "build/images/carousel-1.png", alt: "evenement 1 from the carousel", width: 325, height: 325 },
            link: "/",
            label: "Evenement 1",
            description: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
            ],
        },
        {
            img: { src: "build/images/carousel-2.png", alt: "evenement 2 from the carousel", width: 325, height: 325 },
            link: "/",
            label: "Evenement 2",
            description: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
            ],
        },
        {
            img: { src: "build/images/carousel-3.png", alt: "evenement 3 from the carousel", width: 325, height: 325 },
            link: "/",
            label: "Evenement 3",
            description: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
            ],
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

            <section className="flex flex-col items-center justify-center gap-10">
                <h3 className="text-3xl text-secondary font-semibold">Evenement Blog</h3>
                <Carousel opts={{ align: "start", loop: true, startIndex: 1 }} className="max-w-5xl">
                    <CarouselContent>
                        {
                            /* on loop bêtement 2 fois sur carousel pour avoir plus d'élément */ [1, 2].map(() =>
                                carousel.map((item, index) => (
                                    <CarouselItem
                                        key={index}
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
                    <CarouselPrevious className="text-secondary scale-[3] translate-x-[100%]" variant={"ghost"} />
                    <CarouselNext className="text-secondary scale-[3] -translate-x-[100%]" variant={"ghost"} />
                </Carousel>
            </section>

            <CommunFaq />
        </div>
    );
}
