import React from "react";
import { useEffect, useState } from "react";
import { Select as RadixSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

type ContactType = {
    id: number;
    type: string;
};

export default function SelectContactType() {
    const [contactTypes, setContactTypes] = useState<ContactType[]>([]);

    useEffect(() => {
        const fetchContactTypes = async () => {
            try {
                const res = await fetch("/api/contact/types");
                const json = await res.json();

                if (res.ok) {
                    setContactTypes(json.data || []);
                } else {
                    console.error("Erreur lors de la récupération des types :", json.message);
                }
            } catch (error) {
                console.error("Erreur réseau :", error);
            }
        };

        fetchContactTypes();
    }, []);

    return (
        <RadixSelect name="contactType">
            <SelectTrigger className="w-[225px] rounded-full bg-grey text-white border-none">
                <SelectValue placeholder="Veuillez sélectionner" />
            </SelectTrigger>
            <SelectContent className="bg-grey text-white">
                {contactTypes.map((type) => (
                    <SelectItem key={type.id} value={String(type.id)} className="hover:bg-stone-400 rounded-lg">
                        {type.type}
                    </SelectItem>
                ))}
            </SelectContent>
        </RadixSelect>
    );
}
