import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/auth-context";
import CommunFaq from "../components/CommunFaq";
import { Hero } from "../components/Hero";
import { Input } from "../components/Input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import SelectContactType from "../components/SelectContactType";

export default function Page() {
    const { user } = useAuth();

    // 1. State pour gérer le form
    const [formData, setFormData] = useState({
        contactType: "",
        lastName: "",
        firstName: "",
        company: "",
        email: "",
        message: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // 2. Si user connecté, préremplir les champs
    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                lastName: user.lastName || "",
                firstName: user.firstName || "",
                company: user.company || "",
                email: user.email || "",
            }));
        }
    }, [user]);

    // 3. Soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccessMessage("");

        try {
            const res = await fetch("/api/contact/make", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    contactTypeId: parseInt(formData.contactType, 10),
                }),
            });

            const json = await res.json();

            if (res.ok) {
                setSuccessMessage(json.message || "Votre message a été envoyé !");
                setFormData((prev) => ({ ...prev, message: "", contactType: "" }));
            } else {
                setErrors(json.errors || {});
            }
        } catch (error) {
            alert("Erreur de communication avec le serveur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Hero title="Formulaire de contact" img={{ src: "/build/images/contact/hero.png", alt: "banniere" }} />

            <section className="space-y-10 w-full px-20">
                <h3 className="text-secondary text-3xl font-semibold">Nous contacter</h3>

                <form onSubmit={handleSubmit} className="flex flex-col justify-between gap-5 [&_label]:max-w-none">
                    {/* Sélection du type de contact */}
                    <div className="flex flex-col gap-2">
                        <SelectContactType
                            value={formData.contactType}
                            onChange={(value) => setFormData((prev) => ({ ...prev, contactType: value }))}
                        />
                        {errors.contactType && <p className="text-red-500 text-sm">{errors.contactType}</p>}
                    </div>

                    <div className="w-full grid grid-cols-2 justify-items-center gap-10">
                        <div className="flex flex-col gap-2 w-full">
                            <Input
                                placeholder="Votre nom.."
                                name="name"
                                htmlFor="name"
                                type="text"
                                value={formData.lastName}
                                disabled={!!user}
                                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                            />
                            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <Input
                                placeholder="Votre prénom.."
                                name="firstname"
                                htmlFor="firstname"
                                type="text"
                                value={formData.firstName}
                                disabled={!!user}
                                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                            />
                            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-2 w-full">
                            <Input
                                placeholder="Votre entreprise.."
                                name="company"
                                htmlFor="company"
                                type="text"
                                value={formData.company}
                                disabled={!!user}
                                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                            />
                            {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <Input
                                placeholder="Votre email.."
                                name="email"
                                htmlFor="email"
                                type="email"
                                value={formData.email}
                                disabled={!!user}
                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <Textarea
                            name="message"
                            id="message"
                            placeholder="Votre message.."
                            value={formData.message}
                            onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                        />
                        {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
                    </div>

                    <div className="w-full grid justify-items-center">
                        <Button
                            type="submit"
                            className="bg-dark-secondary text-white py-2 px-6 rounded-3xl w-fit border"
                            disabled={loading}>
                            {loading ? "Envoi en cours..." : "Envoyer"}
                        </Button>
                    </div>

                    {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}
                </form>
            </section>

            {/* Coordonnées et Google Maps */}
            <article className="flex center justify-around [&_.wrapper]:w-[500px]">
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
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2760.8816768770323!2d6.141157315602687!3d46.2072439791161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c64ff8f7584d9%3A0xe39bffddc1913fc!2sRue%20de%20Neuchâtel%208%2C%201201%20Genève%2C%20Suisse!5e0!3m2!1sen!2sfr!4v1707324581000"
                    />
                </div>
            </article>

            <CommunFaq />
        </>
    );
}
