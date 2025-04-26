import { PlusIcon } from "lucide-react";
import React from "react";
import { cn } from "../utils";
import { Input as RadixInput } from "./ui/input";

export const Input = ({
    name,
    htmlFor,
    placeholder,
    type,
    color,
    bg,
    iconSize,
    value,
    onChange,
    disabled,
}: {
    name: string;
    htmlFor: string;
    placeholder: string;
    type: string;
    color?: "white" | "black";
    bg?: "white" | "grey";
    iconSize?: number;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}) => {
    const xcolor = color === "black" ? "text-black" : "text-white";
    const xbg = bg === "white" ? "bg-white" : "bg-grey";
    const xplaceholder = color === "black" ? "placeholder:text-black" : "placeholder:text-white";

    return (
        <label htmlFor={htmlFor} className={cn("relative w-full max-w-[90%]", xcolor)}>
            <RadixInput
                type={type}
                name={name}
                id={htmlFor}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={cn("rounded-full h-10 w-full", xplaceholder, xbg)}
                disabled={disabled}
            />
            <PlusIcon size={iconSize || 18} className="rotate-45 absolute top-1/2 right-2 transform -translate-y-1/2" />
        </label>
    );
};

// const Input = ({
//     name,
//     htmlFor,
//     placeholder,
//     type,
// }: {
//     name: string;
//     htmlFor: string;
//     placeholder: string;
//     type: string;
// }) => {
//     return (
//         <label htmlFor={htmlFor} className="relative w-full max-w-[90%]">
//             <RadixInput
//                 type={type}
//                 name={name}
//                 id={htmlFor}
//                 placeholder={placeholder}
//                 className="bg-white text-black placeholder:text-black rounded-full h-8"
//             />
//             <PlusIcon size={16} className="text-black rotate-45 absolute top-1/2 right-2 transform -translate-y-1/2" />
//         </label>
//     );
// };
