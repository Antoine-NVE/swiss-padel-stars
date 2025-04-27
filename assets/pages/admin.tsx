import React, { useState } from "react";
import { Hero } from "../components/Hero";
import { Button } from "../components/ui/button";
import { format } from "date-fns";

export default function AdminPage() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        setLoadingUsers(true);
        setError("");
        try {
            const res = await fetch("/api/user/get-all");
            const json = await res.json();

            if (res.ok) {
                setUsers(json.data || []);
            } else {
                setError(json.message || "Erreur lors du chargement des utilisateurs.");
            }
        } catch (e) {
            setError("Erreur de communication avec le serveur.");
        } finally {
            setLoadingUsers(false);
        }
    };

    return (
        <>
            <Hero title="Administration" img={{ src: "/build/images/admin/hero-admin.png", alt: "Bannière admin" }} />

            <section className="space-y-10 w-full px-20 pt-10 pb-20">
                <h3 className="text-secondary text-3xl font-semibold">Dashboard</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AdminCard
                        title="Utilisateurs"
                        description="Liste et gestion des utilisateurs."
                        buttonText="Voir les utilisateurs"
                        onClick={fetchUsers}
                    />
                </div>

                {/* Affichage des utilisateurs */}
                <div className="mt-12 space-y-6">
                    {loadingUsers && <p className="text-primary">Chargement...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {users.length > 0 && (
                        <div className="grid gap-6">
                            {users.map((user) => (
                                <div key={user.id} className="bg-grey rounded-lg p-4 w-full max-w-md">
                                    <p>
                                        <strong>Nom :</strong> {user.lastName} {user.firstName}
                                    </p>
                                    <p>
                                        <strong>Email :</strong> {user.email}
                                    </p>
                                    <p>
                                        <strong>Entreprise :</strong> {user.company || "Non renseignée"}
                                    </p>
                                    <p>
                                        <strong>Newsletter :</strong> {user.newsletterOptin ? "Oui" : "Non"}
                                    </p>
                                    <p>
                                        <strong>Compte vérifié :</strong> {user.isVerified ? "Oui" : "Non"}
                                    </p>
                                    <p>
                                        <strong>Utilisateur anonyme :</strong> {user.isAnonymous ? "Oui" : "Non"}
                                    </p>
                                    <p>
                                        <strong>Rôles :</strong> {user.roles.join(", ")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

const AdminCard = ({
    title,
    description,
    buttonText,
    onClick,
}: {
    title: string;
    description: string;
    buttonText: string;
    onClick?: () => void;
}) => (
    <div className="bg-grey rounded-2xl p-8 text-white flex flex-col justify-between shadow-lg min-h-[250px]">
        <div>
            <h4 className="text-2xl font-bold mb-3">{title}</h4>
            <p className="text-balance text-justify">{description}</p>
        </div>
        <div className="mt-6">
            <Button onClick={onClick} className="bg-dark-secondary text-white py-2 px-6 rounded-3xl w-fit border">
                {buttonText}
            </Button>
        </div>
    </div>
);

// Types
type UserType = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    company: string | null;
    newsletterOptin: boolean;
    isVerified: boolean;
    isAnonymous: boolean;
    createdAt?: string | null;
    updatedAt?: string | null;
    roles: string[];
};
