import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/auth-context";
import { Input } from "../components/Input";
import { Button } from "../components/ui/button";

export default function Page() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        email: user?.email || "",
        lastName: user?.lastName || "",
        firstName: user?.firstName || "",
        company: user?.company || "",
        newsletterOptin: user?.newsletterOptin || false,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email || "",
                lastName: user.lastName || "",
                firstName: user.firstName || "",
                company: user.company || "",
                newsletterOptin: user.newsletterOptin || false,
            });
        }
    }, [user]);

    if (!user) {
        return (
            <div className="pt-32 p-8 text-center">
                <h1 className="text-2xl font-bold mb-4 text-primary">Chargement du profil...</h1>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccessMessage("");

        try {
            const response = await fetch("/api/user/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const json = await response.json();

            if (!response.ok) {
                setErrors(json.errors || {});
            } else {
                setSuccessMessage(json.message || "Profil mis à jour avec succès !");
            }
        } catch (error) {
            alert("Erreur de communication avec le serveur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 p-8 flex flex-col items-center min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-primary">Votre profil</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center gap-6 w-full max-w-md">
                {/* Petit avatar rond avec initiales */}
                <div className="bg-primary text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold">
                    {(user.firstName?.[0] || "?") + (user.lastName?.[0] || "")}
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <FormField
                        label="Nom"
                        value={formData.lastName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                        error={errors.lastName}
                    />
                    <FormField
                        label="Prénom"
                        value={formData.firstName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                        error={errors.firstName}
                    />
                    <FormField
                        label="Email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        error={errors.email}
                    />
                    {/* Affichage du message spécial sous l'email si utilisateur vérifié */}
                    {user.isVerified && (
                        <p className="text-xs text-gray-500">
                            Modifier votre email annulera la vérification de votre compte.
                        </p>
                    )}
                    <FormField
                        label="Entreprise"
                        value={formData.company || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                        error={errors.company}
                    />
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-500">S'abonner à la newsletter :</label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="newsletterOptin"
                                    value="true"
                                    checked={formData.newsletterOptin === true}
                                    onChange={() => setFormData((prev) => ({ ...prev, newsletterOptin: true }))}
                                />
                                Oui
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="newsletterOptin"
                                    value="false"
                                    checked={formData.newsletterOptin === false}
                                    onChange={() => setFormData((prev) => ({ ...prev, newsletterOptin: false }))}
                                />
                                Non
                            </label>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="bg-dark-secondary text-white py-2 px-6 rounded-3xl w-fit"
                    disabled={loading}>
                    {loading ? "Mise à jour..." : "Mettre à jour"}
                </Button>

                {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
            </form>
        </div>
    );
}

const FormField = ({
    label,
    value,
    onChange,
    error,
}: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-500">{label} :</label>
        <Input
            type="text"
            value={value}
            onChange={onChange}
            name={label.toLowerCase()}
            htmlFor={label.toLowerCase()}
            placeholder={label}
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
);
