import { MenuIcon, ShieldCheckIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth-context";
import type { CartProductType, NavLink as NavLinkType } from "../types";
import { calcPriceFromString, cn } from "../utils";
import { Input } from "./Input";
import Logo from "./Logo";
import { Button, Button as RadixButton } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown";
import Spacer from "./ui/spacer";

const ICON_SIZE = 32;
const endpoints = {
    register: "/api/auth/register",
    login: "/api/auth/login",
    profile: "/api/profile/user",
};

// --
// Le header ( Header ) est en 3 parties :
// 1. La navigation ( Nav, contient logo qui est un lien )
// 2. La section d'authentification ( AuthSection )
// 3. La section du panier ( CartSection )

/**
 * Navigation
 */
const Nav = ({ links }: { links: NavLinkType[] }) => {
    const [open, setOpen] = useState(false);

    return (
        <nav className="flex center w-1/2">
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger>
                    <MenuIcon className="text-secondary" size={ICON_SIZE} />
                </DropdownMenuTrigger>
                <Content className="min-h-[250px]">
                    {links
                        .filter((link) => link.navbar !== false && link.available !== false)
                        .map((link) => (
                            <div
                                key={link.label}
                                className="grow text-secondary font-medium text-xl hover:bg-primary/90 hover:[&_a]:underline p-2"
                                onClick={() => setOpen(false)} // <<<<< fermer au clic
                            >
                                <NavLink to={link.href}>{link.label}</NavLink>
                            </div>
                        ))}
                </Content>
            </DropdownMenu>
            <Spacer />
            <Logo className="sm:translate-x-[100%]" />
        </nav>
    );
};

/**
 * Auth forms
 */
const AuthSection = ({ Icon }: { Icon: React.ReactNode }) => {
    const { user, login, register, logout } = useAuth();
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({
        company: "",
        lastName: "",
        firstName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await login(loginData.email, loginData.password);
        alert(result.message);
    };

    const [registerErrors, setRegisterErrors] = useState<{ [key: string]: string }>({});

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await register(registerData);

        if (result.success) {
            alert(result.message);
            setRegisterErrors({});
        } else {
            setRegisterErrors(result.errors || {});
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="text-secondary">
                <div className="relative">
                    {Icon}
                    <svg width="25" height="25" viewBox="0 0 20 20" className="absolute bottom-0 right-0 opacity-90">
                        <circle cx="15" cy="15" r="5" fill={user ? "green" : "red"} />
                    </svg>
                </div>
            </DropdownMenuTrigger>
            <Content
                className={`${
                    user ? "min-w-[12rem] max-w-[16rem] items-center" : "min-w-[20rem] max-w-[24rem] items-stretch"
                } p-4 flex flex-col gap-3`}>
                {!user ? (
                    <>
                        <SubTitle>
                            <h3>Connexion</h3>
                        </SubTitle>
                        <form onSubmit={handleLogin} className="flex flex-col gap-5">
                            <Input
                                type="email"
                                placeholder="Email"
                                name="email"
                                htmlFor="email"
                                value={loginData.email}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            />
                            <Input
                                type="password"
                                placeholder="Mot de passe"
                                name="password"
                                htmlFor="password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            />
                            <Button type="submit">Se connecter</Button>
                        </form>
                        <DropdownMenuSeparator />
                        <SubTitle>
                            <h3>Inscription</h3>
                        </SubTitle>
                        <form onSubmit={handleRegister} className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <Input
                                    placeholder="Nom *"
                                    name="lastName"
                                    htmlFor="lastName"
                                    type="text"
                                    value={registerData.lastName}
                                    onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                                />
                                {registerErrors.lastName && (
                                    <p className="text-red-500 text-sm mt-1">{registerErrors.lastName}</p>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <Input
                                    placeholder="Prénom *"
                                    name="firstName"
                                    htmlFor="firstName"
                                    type="text"
                                    value={registerData.firstName}
                                    onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                                />
                                {registerErrors.firstName && (
                                    <p className="text-red-500 text-sm mt-1">{registerErrors.firstName}</p>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <Input
                                    placeholder="Entreprise"
                                    name="company"
                                    htmlFor="company"
                                    type="text"
                                    value={registerData.company}
                                    onChange={(e) => setRegisterData({ ...registerData, company: e.target.value })}
                                />
                                {registerErrors.company && (
                                    <p className="text-red-500 text-sm mt-1">{registerErrors.company}</p>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <Input
                                    placeholder="Adresse email *"
                                    name="email"
                                    htmlFor="email"
                                    type="email"
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                />
                                {registerErrors.email && (
                                    <p className="text-red-500 text-sm mt-1">{registerErrors.email}</p>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <Input
                                    placeholder="Mot de passe *"
                                    name="password"
                                    htmlFor="password"
                                    type="password"
                                    value={registerData.password}
                                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                />
                                {registerErrors.password && (
                                    <p className="text-red-500 text-sm mt-1">{registerErrors.password}</p>
                                )}
                            </div>

                            {/* Pas la force de traiter ça */}
                            {/* <div className="flex flex-col">
                                <Input
                                    placeholder="Confirmer mot de passe *"
                                    name="confirmPassword"
                                    htmlFor="confirmPassword"
                                    type="password"
                                    value={registerData.confirmPassword}
                                    onChange={(e) =>
                                        setRegisterData({ ...registerData, confirmPassword: e.target.value })
                                    }
                                />
                                {registerErrors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{registerErrors.confirmPassword}</p>
                                )}
                            </div> */}
                            <Button type="submit">S'inscrire</Button>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col gap-3 mt-2">
                            <Button onClick={() => navigate("/profil")}>Voir mon profil</Button>
                            <Button onClick={handleLogout}>Se déconnecter</Button>
                        </div>
                    </>
                )}
            </Content>
        </DropdownMenu>
    );
};

const products: CartProductType[] = [
    {
        id: "1",
        name: "Raquette de padel ping-pong",
        price: "60.00",
        unit: "CHF",
        img: {
            src: "build/images/header/raquette.png",
            alt: "une raquette de padel ping-pong",
            width: 200,
            height: 180,
        },
    },
    {
        id: "2",
        name: "Balles de padel ping-pong",
        price: "30.00",
        unit: "CHF",
        img: {
            src: "build/images/header/balles.png",
            alt: "des balles blanches de padel ping-pong",
            width: 200,
            height: 180,
        },
    },
];

type ProductLookup = { id: string; quantity: number; price: string };
/**
 * Cart section with lorem products
 */
const CartSection = ({ title, Icon }: { title: string; Icon: React.ReactNode }) => {
    const [lookup, setLookup] = useState<{ state: ProductLookup[]; total: string }>({
        state: products.map(({ id, price }) => {
            return {
                id,
                price,
                quantity: 0,
            };
        }),
        total: "",
    });

    const handleQuantity = (id: string, action: "increment" | "decrement") => {
        setLookup((previous) => {
            const state = previous.state.map((product) =>
                product.id === id
                    ? {
                          ...product,
                          quantity:
                              action === "increment"
                                  ? product.quantity + 1
                                  : product.quantity - 1 < 0
                                  ? product.quantity
                                  : product.quantity - 1,
                      }
                    : product
            );

            const total = state.reduce((acc, cur) => {
                const currentQuantity = cur.quantity;
                const currentPrice = cur.price;
                const amount = calcPriceFromString(currentPrice, currentQuantity);
                return acc + amount;
            }, 0);

            return {
                state,
                total: total.toFixed(2),
            };
        });
    };

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
                            product={product}
                            handler={handleQuantity}
                            lookup={lookup.state.find((l) => l.id === product.id) as ProductLookup}
                            key={product.id}
                        />
                    ))}
                    <div className="w-full h-16 rounded-full bg-grey flex items-center justify-between px-4">
                        <div className="flex gap-3 items-center">
                            <p className="text-secondary text-left font-semibold text-lg">Sous-total :</p>
                            <p className="font-medium text-white">{lookup.total || "0.00"} CHF</p>
                        </div>
                        <Button>Valider le panier</Button>
                    </div>
                </section>
            </Content>
        </DropdownMenu>
    );
};

/**
 * MAIN COMPONENT HEADER
 */
export default function Header({ links }: { links: NavLinkType[] }) {
    const { user } = useAuth(); // Récupère l'utilisateur

    return (
        <header className="absolute flex items-center justify-around w-screen bg-primary/90 py-4 px-4 z-50 h-16 md:h-20 lg:h-24">
            <div className="w-full flex justify-between items-center">
                <Nav links={links} />
                <Spacer />
                <section className="inline-flex items-center justify-end w-1/2 gap-1 sm:gap-5">
                    {/* Si l'utilisateur est admin, on affiche l'icône */}
                    {user?.roles.includes("ROLE_ADMIN") && (
                        <NavLink to="/admin" title="Accéder à l'administration">
                            <Button variant="ghost" size="icon">
                                <ShieldCheckIcon size={ICON_SIZE} />
                            </Button>
                        </NavLink>
                    )}

                    <AuthSection Icon={<UserIcon size={ICON_SIZE} />} />
                    {/* <CartSection title="Votre panier" Icon={<ShoppingCartIcon size={ICON_SIZE} />} /> */}
                    <NavLink to="/contact">
                        <Button>Contact</Button>
                    </NavLink>
                </section>
            </div>
        </header>
    );
}

type CartProductProps = {
    product: CartProductType;
    lookup: ProductLookup;
    handler: (id: string, action: "increment" | "decrement") => void;
};
/**
 * Styled components ( secondary UI components )
 */
const CartProduct = ({ handler, lookup, product }: CartProductProps) => {
    const { src, alt } = product.img;
    const { id, name, price, unit } = product;

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
                    <p className="grow text-center">{lookup.quantity}</p>
                    <Spacer />
                </div>
                <div className="flex items-center justify-center">
                    <Button
                        className="rounded-xl bg-primary/20 hover:bg-primary/30 mix-blend-plus-lighter rounded-r-none h-6"
                        onClick={() => handler(id, "decrement")}>
                        -
                    </Button>
                    <Button
                        onClick={() => handler(id, "increment")}
                        className="rounded-xl bg-primary/20 hover:bg-primary/30 mix-blend-plus-lighter rounded-l-none h-6">
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

const Box = ({
    children,
    as,
    onSubmit,
}: {
    children: React.ReactNode;
    as: "form" | "div";
    onSubmit?: (data: any) => void;
}) => {
    return (
        <>
            {as === "form" ? (
                <form onSubmit={onSubmit} className="flex flex-col justify-evenly px-6 grow items-center gap-5">
                    {children}
                </form>
            ) : (
                <div className="flex flex-col justify-evenly px-6 grow items-center gap-5">{children}</div>
            )}
        </>
    );
};

const SubTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <DropdownMenuLabel className={cn("text-secondary text-2xl mb-3", className)} asChild>
            {children}
        </DropdownMenuLabel>
    );
};
