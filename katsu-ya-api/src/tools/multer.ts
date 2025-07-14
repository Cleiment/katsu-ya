import multer from "multer"
import { ErrorResponse } from "../definitions/errors"
import path from "node:path"

const publicPath = __dirname + "/../../public/"

type Storages = "menu"
type StorageDestinations = {
    [storage in Storages]: string
}

const storageDestinations: StorageDestinations = {
    menu: publicPath + "images/menu-image/",
}

const imageFileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true)
    } else {
        cb(new Error("Only image files are allowed!"))
    }
}

export const uploadImage = (storage: Storages, isImage: boolean = false) => {
    let path: string = ""

    if (storage == "menu") path = storageDestinations.menu
    else throw new ErrorResponse("Storage doesn't exist", 400)

    let multerStorage: multer.Multer
    if (isImage) {
        multerStorage = multer({
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, path)
                },
                filename: (req, file, cb) => {
                    cb(null, Date.now() + "_" + file.originalname)
                },
            }),
            fileFilter: imageFileFilter,
        })
    } else {
        multerStorage = multer({
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, path)
                },
                filename: (req, file, cb) => {
                    cb(null, Date.now() + "_" + file.originalname)
                },
            }),
        })
    }

    const response: { path: string; storage: multer.Multer } = {
        path: path,
        storage: multerStorage,
    }

    return response
}
