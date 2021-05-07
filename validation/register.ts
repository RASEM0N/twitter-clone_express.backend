import { body } from 'express-validator'

const registerValidation = [
    // email
    body('email', 'Электронная почта')
        .isString()
        .isEmail()
        .isLength({
            min: 10,
            max: 40,
        })
        .withMessage('Допустимое кол-во символов в почте от 10 до 40'),

    // username
    body('username', 'Логин')
        .isString()
        .isLength({
            min: 4,
            max: 24,
        })
        .withMessage('Допустимое кол-во символов от 4 до 24'),

    // fullname
    body('fullname', 'Имя пользователя')
        .isString()
        .isLength({
            min: 4,
            max: 24,
        })
        .withMessage('Допустимое кол-во символов от 4 до 24'),

    // password
    body('password', 'Пароль')
        .isString()
        .isLength({
            min: 6,
            max: 24,
        })
        .withMessage('Допустимое кол-во символов от 4 до 24')
        .custom((value, { req }) => {
            if (value !== req.body.password2) {
                throw new Error('Пароли не совпадают')
            } else {
                return value
            }
        }),
]

export default registerValidation