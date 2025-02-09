import React from "react";
import CommunFaq from "../components/CommunFaq";
import { Hero } from "../components/Hero";
import { Input } from "../components/Input";
import { Button } from "../components/ui/button";
import { Select as RadixSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";

export default function Page() {
    return (
        <div className="grow bg-dark-primary space-y-10">
            <Hero title="Formulaire de contact" img={{ src: "/build/images/contact/hero.png", alt: "banniere" }} />
            {/* FORMULAIRE DE CONTACT */}
            {/* FORMULAIRE DE CONTACT */}
            {/* FORMULAIRE DE CONTACT */}
            {/* FORMULAIRE DE CONTACT */}
            {/* FORMULAIRE DE CONTACT */}
            <section className="space-y-10 w-full px-20">
                <h3 className="text-secondary text-3xl font-semibold">Nous contacter</h3>
                <form className="flex flex-col justify-between gap-10 [&_label]:max-w-none">
                    <Select />
                    <div className="w-full grid grid-cols-2 justify-items-center gap-10 ">
                        <Input placeholder="Votre nom.." name="name" htmlFor="name" type="text" />
                        <Input placeholder="Votre prénom.." name="firstname" htmlFor="firstname" type="text" />
                    </div>
                    <div className="flex flex-col gap-10">
                        <Input placeholder="Votre entreprise.." name="company" htmlFor="company" type="text" />
                        <Input placeholder="Votre email.." name="email" htmlFor="email" type="email" />
                    </div>
                    <Textarea name="message" id="message" placeholder="Votre message.." />
                    <div className="w-full grid justify-items-center">
                        <Button className="bg-dark-secondary text-white py-2 px-6 rounded-3xl w-fit border">
                            Envoyer
                        </Button>
                    </div>
                </form>
            </section>
            {/* Coordonnée + MAP */}
            {/* Coordonnée + MAP */}
            {/* Coordonnée + MAP */}
            {/* Coordonnée + MAP */}
            {/* Coordonnée + MAP */}
            {/* Coordonnée + MAP */}
            {/* Coordonnée + MAP */}
            <article className={"flex center justify-around [&_.wrapper]:w-[500px]"}>
                <div className="wrapper flex flex-col items-start justify-around">
                    <h3 className="text-secondary text-3xl font-semibold mb-3">Siège social</h3>
                    <p className="text-white text-xl text-balance text-justify">Rue de Neuchâtel 8, 1201 Genève</p>
                    <p className="text-white text-xl text-balance text-justify">hello@swisspadelstars.com</p>
                    <p className="text-white text-xl text-balance text-justify">+41 79 317 61 90</p>
                </div>
                <div className="wrapper">
                    <iframe
                        className="rounded-xl"
                        width="500"
                        height="325"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2760.8816768770323!2d6.141157315602687!3d46.2072439791161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c64ff8f7584d9%3A0xe39bffddc1913fc!2sRue%20de%20Neuch%C3%A2tel%208%2C%201201%20Gen%C3%A8ve%2C%20Suisse!5e0!3m2!1sen!2sfr!4v1707324581000"></iframe>
                </div>
            </article>
            <CommunFaq />
        </div>
    );
}

const Select = () => {
    return (
        <RadixSelect>
            <SelectTrigger className="w-[225px] rounded-full bg-grey text-white border-none">
                <SelectValue placeholder="Veuillez sélectionner" />
            </SelectTrigger>
            <SelectContent className="bg-grey text-white">
                <SelectItem className="hover:bg-stone-400 rounded-lg" value="option-1">
                    Option 1
                </SelectItem>
                <SelectItem className="hover:bg-stone-400 rounded-lg" value="option-2">
                    Option 2
                </SelectItem>
                <SelectItem className="hover:bg-stone-400 rounded-lg" value="option-3">
                    Option 3
                </SelectItem>
            </SelectContent>
        </RadixSelect>
    );
};
