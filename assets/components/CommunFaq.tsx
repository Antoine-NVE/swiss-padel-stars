import React from "react";
import { Button, Button as RadixButton } from "../components/ui/button";
import { FaqType } from "../types";
import { cn } from "../utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const defaultFaq: FaqType[] = [
    {
        id: "1",
        question: "Où sont vos évènements ?",
        answer: "Nos événements se déroulent dans divers lieux à travers la Suisse. Nous choisissons des emplacements stratégiques pour maximiser l'expérience des participants. Consultez notre calendrier pour les prochaines dates et lieux.",
    },
    {
        id: "2",
        question: "Comment installer un terrain de padel chez moi ?",
        answer: "Nos événements se déroulent dans divers lieux à travers la Suisse. Nous choisissons des emplacements stratégiques pour maximiser l'expérience des participants. Consultez notre calendrier pour les prochaines dates et lieux.",
    },
    {
        id: "3",
        question: "Quels sont les avantages de jouer au padel ?",
        answer: "Nos événements se déroulent dans divers lieux à travers la Suisse. Nous choisissons des emplacements stratégiques pour maximiser l'expérience des participants. Consultez notre calendrier pour les prochaines dates et lieux.",
    },
    {
        id: "4",
        question: "Comment puis-je m'inscrire à un évènement ?",
        answer: "Nos événements se déroulent dans divers lieux à travers la Suisse. Nous choisissons des emplacements stratégiques pour maximiser l'expérience des participants. Consultez notre calendrier pour les prochaines dates et lieux.",
    },
    {
        id: "5",
        question: "Quels sont les équipements nécessaires pour jouer au padel ?",
        answer: "Nos événements se déroulent dans divers lieux à travers la Suisse. Nous choisissons des emplacements stratégiques pour maximiser l'expérience des participants. Consultez notre calendrier pour les prochaines dates et lieux.",
    },
];

export default function CommunFaq({ faq = defaultFaq }: { faq?: FaqType[] }) {
    return (
        <section className="flex flex-col items-start px-36 py-6 space-y-6 bg-primary/20  text-white">
            <p className="text-white">
                Découvrez les réponses aux questions fréquentes concernant nos services et événements de padel.
            </p>
            <Accordion type="single" collapsible className="w-full space-y-3">
                {faq.map((item) => (
                    <AccordionItem key={item.id} value={item.id} className="bg-grey rounded-lg border-0 px-4">
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            <div className="flex justify-center items-center gap-5 w-full">
                <p>Vous avez une autre question ? </p>
                <a href="/contact">
                    <Button className="rounded-md">Contactez-nous</Button>
                </a>
            </div>
        </section>
    );
}
