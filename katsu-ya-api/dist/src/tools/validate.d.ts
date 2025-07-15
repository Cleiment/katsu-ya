import { TValidationRequestBody, TValidationRequirement } from "../definitions/types";
export declare const validate: (options: (string | TValidationRequirement)[], req: TValidationRequestBody) => void;
export declare const booleanFromString: (value: string) => boolean;
