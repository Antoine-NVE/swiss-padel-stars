import React, { useEffect, useState } from "react";
import { cn } from "../utils";
import { useAuth } from "../hooks/auth-context";
import { Input } from "./Input";
import Logo from "./Logo";
import { Button } from "./ui/button";
import Instagram from "./ui/icons/Instagram";
import Linkedin from "./ui/icons/Linkedin";

const Separator = ({ className, height = 2 }: { className?: string; height?: number }) => {
    return <div className={cn("bg-white w-full", className)} style={{ height: height + "px" }}></div>;
};

export default function Footer() {
    const { user, updateUser } = useAuth();
    const [formEmail, setFormEmail] = useState(user?.email || "");
    const [errors, setErrors] = useState<{ email?: string }>({});
    const [loading, setLoading] = useState(false);

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await fetch(
                user?.newsletterOptin ? "/api/newsletter/unsubscribe" : "/api/newsletter/subscribe",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: formEmail }),
                }
            );
            const json = await response.json();

            if (!response.ok) {
                setErrors(json.errors || {});
            } else {
                updateUser({ newsletterOptin: !user?.newsletterOptin });
            }
        } catch (error) {
            alert("Erreur de communication avec le serveur");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) {
            setFormEmail(user.email);
        }
    }, [user]);

    return (
        <footer className="bg-primary text-white py-8 px-20 space-y-12">
            <section className="flex justify-between items-start">
                <div className="flex h-28 items-center justify-center">
                    <Logo className="h-12" />
                </div>

                <div className="max-w-[35%] space-y-3">
                    <p>Inscrivez-vous à notre newsletter</p>
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-4">
                        <div className="flex gap-4 items-center">
                            <Input
                                name="email"
                                htmlFor="newsletter-email"
                                placeholder="Votre adresse email.."
                                type="email"
                                value={formEmail}
                                onChange={(e) => setFormEmail(e.target.value)}
                                disabled={!!user}
                            />
                            <Button type="submit" disabled={loading}>
                                {user?.newsletterOptin ? "Se désinscrire" : "S'abonner"}
                            </Button>
                        </div>

                        {/* Erreur sous l'input */}
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
}
