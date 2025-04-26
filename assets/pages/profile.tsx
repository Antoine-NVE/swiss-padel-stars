import React from "react";
import { useAuth } from "../hooks/auth-context";

export default function Page() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="pt-32 p-8 text-center">
                <h1 className="text-2xl font-bold mb-4 text-primary">Chargement du profil...</h1>
            </div>
        );
    }

    const initials = (user.firstName?.[0] || "?") + (user.lastName?.[0] || "");

    return (
        <div className="pt-32 p-8 flex flex-col items-center min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-primary">Votre profil</h1>

            <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center gap-6 w-full max-w-md">
                {/* Petit avatar rond avec initiales */}
                <div className="bg-primary text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold">
                    {initials}
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <ProfileItem label="Nom" value={user.lastName} />
                    <ProfileItem label="Prénom" value={user.firstName} />
                    <ProfileItem label="Email" value={user.email} />
                    <ProfileItem label="Entreprise" value={user.company || "Non renseigné"} />
                    <ProfileItem label="Newsletter" value={user.newsletterOptin ? "Oui" : "Non"} />
                    <ProfileItem label="Statut" value={user.isVerified ? "Compte vérifié" : "Compte non vérifié"} />
                </div>
            </div>
        </div>
    );
}

const ProfileItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-500">{label} :</span>
        <span className="text-md">{value}</span>
    </div>
);
