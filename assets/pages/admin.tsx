import React, { useState } from "react";

export default function AdminPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [showSection, setShowSection] = useState<"users" | "contacts" | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/user/get-all");
            const json = await response.json();
            if (response.ok) {
                console.log(json.data);
                setUsers(json.data || []);
                setShowSection("users");
            } else {
                console.error("Erreur serveur utilisateurs :", json.message);
            }
        } catch (err) {
            console.error("Erreur réseau utilisateurs :", err);
        }
    };

    const fetchContacts = async () => {
        try {
            const response = await fetch("/api/contact/get-all");
            const json = await response.json();
            if (response.ok) {
                console.log(json.data);
                setContacts(json.data || []);
                setShowSection("contacts");
            } else {
                console.error("Erreur serveur contacts :", json.message);
            }
        } catch (err) {
            console.error("Erreur réseau contacts :", err);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Non renseigné";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "Non renseigné" : date.toLocaleDateString();
    };

    return (
        <div className="p-10">
            <h1 className="text-3xl text-primary mb-8">Administration</h1>

            {/* BOUTONS */}
            <div className="flex gap-6 mb-10">
                <button onClick={fetchUsers} className="bg-dark-secondary text-white py-2 px-6 rounded-3xl border">
                    Voir les utilisateurs
                </button>
                <button onClick={fetchContacts} className="bg-dark-secondary text-white py-2 px-6 rounded-3xl border">
                    Voir les contacts
                </button>
            </div>

            {/* AFFICHAGE UTILISATEURS */}
            {showSection === "users" && (
                <div className="flex flex-col gap-6 mb-10">
                    <h2 className="text-2xl text-secondary font-bold">Utilisateurs</h2>
                    {users.map((user) => (
                        <div key={user.id} className="p-5 rounded-xl bg-grey text-white">
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
                                <strong>Vérifié :</strong> {user.isVerified ? "Oui" : "Non"}
                            </p>
                            <p>
                                <strong>Anonyme :</strong> {user.isAnonymous ? "Oui" : "Non"}
                            </p>
                            <p>
                                <strong>Créé le :</strong> {formatDate(user.createdAt)}
                            </p>
                            <p>
                                <strong>Mis à jour le :</strong> {formatDate(user.updatedAt)}
                            </p>
                            <p>
                                <strong>Rôles :</strong> {user.roles?.join(", ") || "Aucun"}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* AFFICHAGE CONTACTS */}
            {showSection === "contacts" && (
                <div className="flex flex-col gap-6 mb-10">
                    <h2 className="text-2xl text-secondary font-bold">Contacts</h2>
                    {contacts.map((contact) => (
                        <div key={contact.id} className="p-5 rounded-xl bg-grey text-white">
                            <p>
                                <strong>Nom :</strong> {contact.user?.lastName} {contact.user?.firstName}
                            </p>
                            <p>
                                <strong>Email :</strong> {contact.user?.email}
                            </p>
                            <p>
                                <strong>Entreprise :</strong> {contact.user?.company || "Non renseignée"}
                            </p>
                            <p>
                                <strong>Type de contact :</strong> {contact.contactType || "Non renseigné"}
                            </p>
                            <p>
                                <strong>Message :</strong> {contact.message}
                            </p>
                            <p>
                                <strong>Envoyé le :</strong> {formatDate(contact.createdAt)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
