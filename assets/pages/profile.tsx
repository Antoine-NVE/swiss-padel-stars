import React from "react";
import { useAuth } from "../hooks/auth-context";

const endpoint = "/api/profile/user";

export default function Page() {
    const { user } = useAuth();

    return (
        <>
            <h1>Votre profil</h1>
            <p>{JSON.stringify(user)}</p>
        </>
    );
}
