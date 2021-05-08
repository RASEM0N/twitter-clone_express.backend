import { body } from 'express-validator'

const registerValidation = [
    // email
    body('email').isString().isEmail().isLength({
        min: 10,
        max: 40,
    }),

    // username
    body('username').isString().isLength({
        min: 4,
        max: 24,
    }),

    // fullname
    body('fullname').isString().isLength({
        min: 4,
        max: 24,
    }),

    // password
    body('password').isString().isLength({
        min: 6,
        max: 24,
    }),
]

export default registerValidation
