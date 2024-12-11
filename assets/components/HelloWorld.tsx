import React from "react";

type HelloWorldProps = {
    name?: string; // Exemple de propriété optionnelle
};

const HelloWorld: React.FC<HelloWorldProps> = ({ name }) => {
    return <h1 className="text-green-500">Hello, {name || "React with TypeScript"}!</h1>;
};

export default HelloWorld;
