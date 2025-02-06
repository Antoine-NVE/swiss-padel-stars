import { PlusIcon } from "lucide-react";
import React from "react";
import Logo from "./components/Logo";
import { Button as RadixButton } from "./components/ui/button";
import Instagram from "./components/ui/icons/Instagram";
import Linkedin from "./components/ui/icons/Linkedin";
import { Input as RadixInput } from "./components/ui/input";
import { cn } from "./utils";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="relative w-screen flex flex-col min-h-screen">
            {children}
            <Footer />
        </main>
    );
}

const Separator = ({ className, height = 2 }: { className?: string; height?: number }) => {
    return <div className={cn("bg-white w-full", className)} style={{ height: height + "px" }}></div>;
};

const Footer = () => {
    return (
        <footer className="bg-primary text-white py-8 px-20 space-y-12">
            <section className="flex justify-between items-start">
                <div className="flex h-28 items-center justify-center">
                    <Logo className="h-12" />
                </div>
                <div className="max-w-[35%] space-y-3">
                    <p>Inscrivez-vous à notre newsletter</p>
                    <form className="flex gap-10 items-center">
                        <Input name="email" htmlFor="email" placeholder="Votre adresse email.." type="email" />
                        <Button>S'abonner</Button>
                    </form>
                    <small className="text-xs block leading-3">
                        En vous abonnant, vous acceptez notre Politique de Confidentialité et consentez à recevoir des
                        mises à jour.
                    </small>
                </div>
                <div className="space-y-3">
                    <p>Suivez-nous sur les réseaux</p>
                    <div className="flex items-center gap-5">
                        <Instagram width={43} height={43} />
                        <p>Instagram</p>
                    </div>
                    <div className="flex items-center gap-5">
                        <Linkedin width={43} height={43} />
                        <p>Linkedin</p>
                    </div>
                </div>
            </section>
            <Separator />
            <section>
                <p>©2025 Swiss Padel Stars | Tous droits réservés</p>
                <nav className="space-x-2">
                    <a href="/">Mentions légales</a> <span>|</span>
                    <a href="/">Politique de confidentialité</a>
                </nav>
            </section>
        </footer>
    );
};

/**
 * ui components
 */
const Button = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <RadixButton
            className={cn("bg-dark-secondary text-white py-2 px-4 rounded-3xl w-fit", className)}
            onClick={console.log}>
            {children}
        </RadixButton>
    );
};

const Input = ({
    name,
    htmlFor,
    placeholder,
    type,
}: {
    name: string;
    htmlFor: string;
    placeholder: string;
    type: string;
}) => {
    return (
        <label htmlFor={htmlFor} className="relative w-full max-w-[90%]">
            <RadixInput
                type={type}
                name={name}
                id={htmlFor}
                placeholder={placeholder}
                className="bg-white text-black placeholder:text-black rounded-full h-8"
            />
            <PlusIcon size={16} className="text-black rotate-45 absolute top-1/2 right-2 transform -translate-y-1/2" />
        </label>
    );
};
