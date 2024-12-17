import React, { useState } from "react";
import type { APIResponse } from "./types";

const ButtonUser = () => {
    const [user, setUser] = useState<APIResponse["USER_SUCCESS"] | null>(null);
    const [error, setError] = useState<APIResponse["USER_ERROR"] | null>(null);

    const fetchUser = async () => {
        setError(null);
        setUser(null);
        const response = await fetch("/api/user");

        if (!response.ok) {
            const data = (await response.json()) as { code: number; message: string };
            setError(data);
            return;
        }

        const usr = (await response.json()) as APIResponse["USER_SUCCESS"];
        setUser(usr);
    };

    return (
        <>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={fetchUser}>
                Fetch user
            </button>
            <button
                onClick={() => {
                    setUser(null);
                    setError(null);
                }}>
                Reset
            </button>
            <div>
                {user && (
                    <span>
                        {" "}
                        : {user.email} {user.roles.join(" ")}
                    </span>
                )}
                {error && (
                    <span className="text-red-500">
                        {" "}
                        : {error.code} {error.message}
                    </span>
                )}
            </div>
        </>
    );
};
export default ButtonUser;
