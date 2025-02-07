import React from "react";
import { type ImgProps } from "../types";

export const Hero = ({ title, img }: { title: string; img: Omit<ImgProps, "width" | "height"> }) => {
    return (
        <div className="relative">
            <img src={img.src} alt={img.alt} className="object-cover w-screen" />
            <h1 className="absolute top-1/2 right-1/2 text-secondary text-6xl font-bold translate-x-[50%] -translate-y-[50%]">
                {title}
            </h1>
        </div>
    );
};
