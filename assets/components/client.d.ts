declare global {
    type APIResponse = {
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

    type APIResponseType<T> = {
        error: string | null;
        message: string | null;
        data: T | null;
    };
}
