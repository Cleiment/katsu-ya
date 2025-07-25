import { Router, json } from "express"
import Transaction from "./transaction.controller"
import { requestHandler } from "../../tools/handler"
import { validate } from "../../tools/validate"
import { ErrorResponse } from "../../definitions/errors"
import { Roles } from "../../config/env.config"

const router = Router()
const transaction = new Transaction()

router.use(json())

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

router.get(
    "/available-table",
    requestHandler(
        async (req, res) => {
            const rs = await transaction.getAvailableTable()
            return rs
        },
        [Roles.admin, Roles.manager, Roles.cashier, Roles.guest]
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

router.get(
    "/get-cart/:id",
    requestHandler(
        async (req, res) => {
            const { id } = req.params
            const rs = await transaction.getTransactionCartById(id)

            return rs
        },
        [Roles.manager, Roles.cashier, Roles.guest]
    )
)

router.post(
    "/cart/new",
    requestHandler(
        async (req, res) => {
            const { idTable, TransactionCart } = req.body
            const idUser = res.locals.userInfo.id

            const rs = await transaction.createTransactionCart(
                TransactionCart.transactionCartDetail,
                idUser,
                idTable
            )
            return rs
        },
        [Roles.manager, Roles.cashier, Roles.guest]
    )
)

// router.post(
//     "/cart/remove_item",
//     requestHandler(
//         async (req, res) => {
//             const { idCartDetail } = req.body

//             const rs = await transaction.deleteFromCart(idCartDetail)
//             return rs
//         },
//         [Roles.cashier, Roles.guest]
//     )
// )

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

router.post(
    "/order/pay",
    requestHandler(
        async (req, res) => {
            const { idCart, paymentType } = req.body
            const rs = await transaction.payCart(idCart, paymentType)
            return rs
        },
        [Roles.manager, Roles.cashier, Roles.guest]
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
    "/order/table/:idTable",
    requestHandler(
        async (req, res) => {
            validate(["idTable"], req.params)
            const idTable = req.params.idTable
            const rs = await transaction.getOrderByTable(parseInt(idTable) || 0)
            return rs
        },
        [Roles.admin, Roles.manager, Roles.cashier, Roles.guest]
    )
)

router.post(
    "/pay/get-token",
    requestHandler(
        async (req, res) => {
            validate(
                ["idCart", "firstName", "email", "phone", "finishLink"],
                req.body
            )
            const { idCart, firstName, email, phone, finishLink } = req.body
            const rs = await transaction.getPaymentToken(
                idCart,
                firstName,
                email,
                phone,
                finishLink
            )
            return rs
        },
        [Roles.manager, Roles.cashier, Roles.guest]
    )
)

router.get(
    "/struk/:idOrder",
    requestHandler(
        async (req, res) => {
            const idOrder = req.params.idOrder
            const rs = await transaction.getTransactionByIdOrder(idOrder)
            return rs
        },
        [Roles.manager, Roles.cashier, Roles.guest]
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
        [Roles.admin, Roles.manager, Roles.cashier, Roles.guest]
    )
)

export default router
