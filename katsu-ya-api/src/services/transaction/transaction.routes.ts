import { Router } from "express"
import Transaction from "./transaction.controller"
import { requestHandler } from "../../tools/handler"
import { validate } from "../../tools/validate"
import { ErrorResponse } from "../../definitions/errors"
import { Roles } from "../../config/env.config"

const router = Router()
const transaction = new Transaction()

router.get(
    "/",
    requestHandler(
        async (req, res) => {
            const rs = await transaction.getTableOrder()
            return rs
        },
        [Roles.admin, Roles.manager, Roles.cashier, Roles.kitchen]
    )
)

router.post(
    "/new",
    requestHandler(
        async (req, res) => {
            validate(["details"], req.body)

            const { details } = req.body
            const idUser = res.locals.userInfo.id

            if (Array.isArray(details)) {
                const validateError = new ErrorResponse()

                if (details.length == 0) throw validateError
                details.forEach((item) => {
                    if (!transaction.validateTransactionDetail(item))
                        throw validateError
                })
            }
            const rs = await transaction.createTransaction(details, idUser)
            return rs
        },
        [Roles.cashier]
    )
)

router.post(
    "/edit",
    requestHandler(
        async (req, res) => {
            validate(["id", "details"], req.body)

            const { id, details } = req.body
            const idUser = res.locals.userInfo.id

            if (Array.isArray(details)) {
                const validateError = new ErrorResponse()

                if (details.length == 0) throw validateError
                details.forEach((item) => {
                    if (!transaction.validateTransactionDetail(item))
                        throw validateError
                })
            }
            const rs = await transaction.editTransaction(id, details, idUser)
            return rs
        },
        [Roles.cashier]
    )
)

router.post(
    "/cart/new",
    requestHandler(
        async (req, res) => {
            const { id, TransactionCart } = req.body
            const idUser = res.locals.userInfo.id

            const rs = await transaction.createTransactionCart(
                TransactionCart[TransactionCart.length - 1]
                    .transactionCartDetail,
                idUser,
                id
            )
            return rs
        },
        [Roles.cashier]
    )
)

router.post(
    "/cart/finish",
    requestHandler(
        async (req, res) => {
            const { paid, transactionCart } = req.body
            const rs = await transaction.finishTransactionCart(
                paid,
                transactionCart
            )
            return rs
        },
        [Roles.cashier]
    )
)

router.get(
    "/orders",
    requestHandler(
        async (req, res) => {
            return await transaction.getTransactionsCart()
        },
        [Roles.cashier, Roles.kitchen]
    )
)

router.post(
    "/report",
    requestHandler(
        async (req, res) => {
            validate(["startDate", "endDate"], req.body)

            const { startDate, endDate } = req.body
            const rs = await transaction.getTransactions(startDate, endDate)
            return rs
        },
        [Roles.admin, Roles.manager, Roles.cashier]
    )
)

router.get(
    "/:id",
    requestHandler(
        async (req, res) => {
            validate(["id"], req.params)
            const id = req.params.id
            const rs = await transaction.getTransactionById(parseInt(id))
            return rs
        },
        [Roles.admin, Roles.manager, Roles.cashier]
    )
)

export default router
