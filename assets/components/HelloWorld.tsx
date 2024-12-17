import React from "react";
import ButtonUser from "./ButtonUser";
import Form from "./Form";

const HelloWorld = () => {
    return (
        <>
            <h1 className="text-green-500">Hello!</h1>
            <div className="w-full flex flex-col items-center justify-center gap-3">
                <ButtonUser />
                <Form url="/api/login" title="LOGIN" />
                <Form url="/api/register" title="REGISTER" />
            </div>
        </>
    );
};

// {
//     "email" : "thomas.cuesta@gmail.com",
//     "password" : "AZERQSDF"
// }

// {
//     "message": "Inscription réussie !"
// }
export default HelloWorld;
