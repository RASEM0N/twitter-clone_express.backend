import { Request, Response } from 'express'
import UserModel from '../models/UserModel'
import { validationResult } from 'express-validator'

class UserController {
    index = async (_: Request, res: Response): Promise<void> => {
        try {
            const users = await UserModel.find().exec()

            res.json({
                status: 'success',
                data: users,
            })

        } catch (error) {
            res.json({
                status: 'error',
                errors: JSON.stringify(error),
            })
        }
    }


    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req)

            if (errors) {
                res.status(400).json({
                    status: 'error',
                    errors: errors.array(),
                })
            }

            const data = {
                email: req.body.email,
                username: req.body.username,
                fullname: req.body.fullname,
                password: req.body.password,
            }

            const user = await UserModel.create(data)

            res.json({
                status: 'success',
                data: user
            })

        } catch (error) {
            res.json({
                status: 'error',
                message: JSON.stringify(error),
            })
        }
    }
}

export const userController = new UserController()