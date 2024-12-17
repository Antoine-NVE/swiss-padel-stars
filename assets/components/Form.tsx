import React, { useState } from "react";

// email & password
const Form = ({ url, title }: { url: string; title: string }) => {
    const [error, setError] = useState<string | null>(null);
    const [fetchData, setFetchData] = useState<{ message: string } | null>(null);

    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        const formdata = new FormData(form);

        const email = formdata.get("email") as string;
        const password = formdata.get("password") as string;

        const credentials = {
            email,
            password,
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const data = (await response.json()) as { error: string };
            setError(`Error fetching ${data.error}`);
            return;
        }

        const data = (await response.json()) as { message: string };
        setFetchData(data);
    };

    return (
        <div>
            <h2>{title}</h2>
            <form action={"/api/login"} method="POST" onSubmit={(e) => handleForm(e)}>
                <label>
                    email:
                    <input type="text" name="email" />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <button type="submit">Submit</button>
            </form>
            {error && <span className="text-red-500"> : {error}</span>}
            {fetchData && <span> : {fetchData.message}</span>}
        </div>
    );
};

export default Form;
