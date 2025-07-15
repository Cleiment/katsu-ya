import { NextFunction, Request, Response } from "express";
import { Role } from "../definitions/types";
export declare const errorHandler: (err: any, req: Request, res: Response, next: NextFunction) => void;
type ControllerType = (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const requestHandler: (controller: ControllerType, roles?: Role["role"][]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
