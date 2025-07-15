export type OValidation = "no_symbol" | "number" | "valid_password" | "array";
export type TErrorResponse = {
    error: {
        message: string;
    };
    statusCode: number;
};
export type TValidationRequirement = {
    field: string;
    requirements?: OValidation[];
};
export type TValidationRequestBody = {
    [k: string]: string | number;
};
export type TValidationFieldError = {
    [k: string]: string[];
};
export type TFileType = "img" | "doc";
export type Role = {
    id: number;
    role: string;
    status: number;
};
