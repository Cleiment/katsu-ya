import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import ingredientRoutes from "../services/ingredient/ingredient.routes"
import categoryRoutes from "../services/category/category.routes"
import menuRoutes from "../services/menu/menu.routes"
import userRoutes from "../services/user/user.routes"
import authRoutes from "../services/auth/auth.routes"
import transactionRoutes from "../services/transaction/transaction.routes"
import { errorHandler, requestHandler } from "../tools/handler"
import { ErrorResponse } from "../definitions/errors"
import path from "path"
import { clientUrl } from "../config/env.config"

const app = express()

const corsOption = {
    origin: clientUrl,
    optionsSuccessStatus: 200,
}

app.use(cors(corsOption))
app.use("/images", express.static(path.join(__dirname, "../../public/images/")))

app.use(authRoutes)
app.use("/user", userRoutes)
app.use("/ingredient", ingredientRoutes)
app.use("/category", categoryRoutes)
app.use("/menu", menuRoutes)
app.use("/transaction", transactionRoutes)

app.use(
    requestHandler((req, res, next) => {
        throw new ErrorResponse()
    })
)

app.use(errorHandler)

export default app
