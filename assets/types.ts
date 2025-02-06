export type APIResponse = {
    LOGIN_SUCCESS: {
        message: string;
    };
    LOGIN_ERROR: {
        message: string;
    };
    USER_SUCCESS: {
        email: string;
        roles: string[];
    };
    USER_ERROR: {
        code: number;
        message: string;
    };
    REGISTER_ERROR: {
        errors: {
            email?: string;
            password?: string;
        };
    };
    REGISTER_SUCCESS: {
        message: string;
    };
};

export type APIResponseType<T> = {
    error: string | null;
    message: string | null;
    data: T | null;
};

export type NavLink = {
    label: string;
    href: string;
};

export type ImgProps = { src: `build/images/${string}` | string; alt: string; width: number; height: number };

export type CartProductType = {
    name: string;
    quantity: number;
    price: string;
    img: ImgProps;
    unit: string;
};

export type FaqType = {
    id: string;
    question: string;
    answer: string;
};

export type IconProps = {
    width: number;
    height: number;
};
