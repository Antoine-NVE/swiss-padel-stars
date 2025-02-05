import { MenuIcon, PlusIcon, ShoppingCart, UserIcon } from "lucide-react";
import React from "react";
import type { NavLink } from "../types";
import { cn } from "../utils";
import { Button as RadixButton } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown";
import { Input as RadixInput } from "./ui/input";
import Spacer from "./ui/spacer";

const ICON_SIZE = 38;

export default function Nav({ links }: { links: NavLink[] }) {
    return (
        <nav className="w-full flex justify-between items-center">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MenuIcon className="text-secondary" size={ICON_SIZE} />
                </DropdownMenuTrigger>
                <Content className="min-h-[500px]">
                    {links.map((link) => (
                        <div
                            key={link.label}
                            className="grow text-secondary text-2xl hover:bg-primary/90 hover:[&_a]:underline p-2">
                            <a href={link.href}>{link.label}</a>
                        </div>
                    ))}
                </Content>
            </DropdownMenu>
            <Spacer />
            {/* LOGO */}
            <a href="/" className="py-2 px-3">
                <img src="/build/images/logo.png" alt="Swiss Padel Stars" className="h-10" />
            </a>
            <Spacer />
            <div className="inline-flex items-center gap-5">
                <DropdownMenu>
                    <DropdownMenuTrigger className="text-secondary">
                        <UserIcon size={ICON_SIZE} />
                    </DropdownMenuTrigger>
                    <Content>
                        <SubTitle>
                            <h3>Connection</h3>
                        </SubTitle>
                        <Box as="form">
                            <Input name="email" htmlFor="login-email" placeholder="Adresse email.." type="email" />
                            <Input
                                name="password"
                                htmlFor="login-password"
                                placeholder="Mot de passe.."
                                type="password"
                            />
                            <Button>Validé</Button>
                        </Box>
                        <DropdownMenuSeparator />
                        <SubTitle>
                            <h3>Inscription</h3>
                        </SubTitle>
                        <Box as="form">
                            <Input
                                name="company"
                                htmlFor="register-company"
                                placeholder="Nom de l'entreprise.."
                                type="text"
                            />
                            <Input name="email" htmlFor="register-email" placeholder="Adresse email.." type="email" />
                            <Input
                                name="password"
                                htmlFor="register-password"
                                placeholder="Mot de passe.."
                                type="password"
                            />
                            <Input
                                name="confirm-password"
                                htmlFor="register-confirm-password"
                                placeholder="Confirmer mot de passe.."
                                type="password"
                            />
                            <Button>Validé</Button>
                        </Box>
                    </Content>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger className="text-secondary">
                        <ShoppingCart size={ICON_SIZE} />
                    </DropdownMenuTrigger>
                    <Content>
                        <SubTitle>
                            <h3>Votre Panier</h3>
                        </SubTitle>
                    </Content>
                </DropdownMenu>
                <a href="/contact">
                    <Button>Contact</Button>
                </a>
            </div>
        </nav>
    );
}

const Content = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <DropdownMenuContent
            className={cn("flex flex-col bg-primary ring-0 border-0 w-[500px] h-fit p-5", className)}
            side="bottom"
            sideOffset={25}>
            {children}
        </DropdownMenuContent>
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
                className="bg-grey text-white placeholder:text-white rounded-full h-10"
            />
            <PlusIcon size={18} className="text-white rotate-45 absolute top-1/2 right-2 transform -translate-y-1/2" />
        </label>
    );
};

const Box = ({ children, as }: { children: React.ReactNode; as: "form" | "div" }) => {
    return (
        <>
            {as === "form" ? (
                <form className="flex flex-col justify-evenly px-6 grow items-center gap-5">{children}</form>
            ) : (
                <div className="flex flex-col justify-evenly px-6 grow items-center gap-5">{children}</div>
            )}
        </>
    );
};

const Button = ({ children }: { children: React.ReactNode }) => {
    return (
        <RadixButton className="bg-dark-secondary text-white py-2 px-4 rounded-3xl w-fit" onClick={console.log}>
            {children}
        </RadixButton>
    );
};

const SubTitle = ({ children }: { children: React.ReactNode }) => {
    return (
        <DropdownMenuLabel className="text-secondary text-2xl mb-3" asChild>
            {children}
        </DropdownMenuLabel>
    );
};
