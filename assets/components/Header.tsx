import { MenuIcon, PlusIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import React from "react";
import type { CartProductType, NavLink } from "../types";
import { cn } from "../utils";
import Logo from "./Logo";
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

// --
// Le header ( Header ) est en 3 parties :
// 1. La navigation ( Nav, contient logo qui est un lien )
// 2. La section d'authentification ( AuthSection )
// 3. La section du panier ( CartSection )

/**
 * Navigation
 */
const Nav = ({ links }: { links: NavLink[] }) => {
    return (
        <nav className="flex center w-1/2">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MenuIcon className="text-secondary" size={ICON_SIZE} />
                </DropdownMenuTrigger>
                <Content className="min-h-[500px]">
                    {links.map((link) => (
                        <div
                            key={link.label}
                            className="grow text-secondary font-medium text-xl hover:bg-primary/90 hover:[&_a]:underline p-2">
                            <a href={link.href}>{link.label}</a>
                        </div>
                    ))}
                </Content>
            </DropdownMenu>
            <Spacer />
            <Logo className="translate-x-[100%]" />
        </nav>
    );
};

/**
 * Auth forms
 */
const AuthSection = ({ Icon }: { Icon: React.ReactNode }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="text-secondary">{Icon}</DropdownMenuTrigger>
            <Content>
                <SubTitle>
                    <h3>Connection</h3>
                </SubTitle>
                <Box as="form">
                    <Input name="email" htmlFor="login-email" placeholder="Adresse email.." type="email" />
                    <Input name="password" htmlFor="login-password" placeholder="Mot de passe.." type="password" />
                    <Button>Validé</Button>
                </Box>
                <DropdownMenuSeparator />
                <SubTitle>
                    <h3>Inscription</h3>
                </SubTitle>
                <Box as="form">
                    <Input name="company" htmlFor="register-company" placeholder="Nom de l'entreprise.." type="text" />
                    <Input name="email" htmlFor="register-email" placeholder="Adresse email.." type="email" />
                    <Input name="password" htmlFor="register-password" placeholder="Mot de passe.." type="password" />
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
    );
};

/**
 * Cart section with lorem products
 */
const CartSection = ({ title, Icon }: { title: string; Icon: React.ReactNode }) => {
    const products: CartProductType[] = [
        {
            name: "Raquette de padel ping-pong",
            quantity: 1,
            price: "60.00",
            unit: "CHF",
            img: { src: "build/images/raquette.png", alt: "une raquette de padel ping-pong", width: 200, height: 180 },
        },
        {
            name: "Balles de padel ping-pong",
            quantity: 2,
            price: "30.00",
            unit: "CHF",
            img: {
                src: "build/images/balles.png",
                alt: "des balles blanches de padel ping-pong",
                width: 200,
                height: 180,
            },
        },
    ];
    // ShoppingCart
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="text-secondary">{Icon}</DropdownMenuTrigger>
            <Content>
                <SubTitle>
                    <h3>{title}</h3>
                </SubTitle>
                <section className="flex flex-col gap-10">
                    {products.map((product) => (
                        <CartProduct
                            name={product.name}
                            quantity={product.quantity}
                            price={product.price}
                            img={product.img}
                            unit={product.unit}
                        />
                    ))}
                </section>
            </Content>
        </DropdownMenu>
    );
};

/**
 * MAIN COMPONENT HEADER
 */
export default function Header({ links }: { links: NavLink[] }) {
    return (
        <header className="absolute flex items-center justify-around w-screen bg-primary/90 py-4 px-4 z-50 h-24">
            <div className="w-full flex justify-between items-center">
                <Nav links={links} />
                <Spacer />
                <section className="inline-flex items-center justify-end w-1/2 gap-5">
                    <AuthSection Icon={<UserIcon size={ICON_SIZE} />} />
                    <CartSection title="Votre panier" Icon={<ShoppingCartIcon size={ICON_SIZE} />} />
                    <a href="/contact">
                        <Button>Contact</Button>
                    </a>
                </section>
            </div>
        </header>
    );
}

/**
 * Styled components ( secondary UI components )
 */
const CartProduct = ({ name, quantity, price, img, unit }: CartProductType) => {
    const { src, alt } = img;

    return (
        <article className="grid grid-cols-2 text-white gap-4 items-center">
            <img src={src} alt={alt} />
            <div className="h-full flex flex-col justify-evenly gap-2">
                <header>
                    <h4 className="text-secondary font-medium">{name}</h4>
                    <p>
                        {price}
                        <span className="ms-2">{unit}</span>
                    </p>
                </header>
                <div className="flex justify-between">
                    <p>Quantité : </p>
                    <p className="grow text-center">{quantity}</p>
                    <Spacer />
                </div>
                <div className="flex items-center justify-center">
                    <Button className="rounded-xl bg-primary/20 hover:bg-primary/30 mix-blend-plus-lighter rounded-r-none h-6">
                        -
                    </Button>
                    <Button className="rounded-xl bg-primary/20 hover:bg-primary/30 mix-blend-plus-lighter rounded-l-none h-6">
                        +
                    </Button>
                </div>
                <footer className="flex items-center justify-evenly">
                    <RadixButton className="underline" variant={"ghost"}>
                        Supprimer
                    </RadixButton>
                    <RadixButton className="underline" variant={"ghost"}>
                        Mettre de coté
                    </RadixButton>
                </footer>
            </div>
        </article>
    );
};

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

const Button = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <RadixButton
            className={cn("bg-dark-secondary text-white py-2 px-4 rounded-3xl w-fit", className)}
            onClick={console.log}>
            {children}
        </RadixButton>
    );
};

const SubTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <DropdownMenuLabel className={cn("text-secondary text-2xl mb-3", className)} asChild>
            {children}
        </DropdownMenuLabel>
    );
};
