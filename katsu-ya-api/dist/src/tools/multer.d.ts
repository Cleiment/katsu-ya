import multer from "multer";
type Storages = "menu";
export declare const uploadImage: (storage: Storages, isImage?: boolean) => {
    path: string;
    storage: multer.Multer;
};
export {};
