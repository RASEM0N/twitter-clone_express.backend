import { Request, Response } from 'express'
import UserModel from '../models/UserModel'
import { validationResult } from 'express-validator'
import { generateMD5 } from '../utils/generateHash'
import sendEmail from '../utils/sendEmail'

class UserController {
    /**
     * Test
     * @route       GET /users
     * @access      Public
     */
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
                errors: error.message,
            })
        }
    }

    /**
     * Create new user
     * @route       POST /users
     * @access      Public
     * @body        email, username, fullname, password & password2
     */
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(400).json({
                    status: 'error',
                    errors: errors.array(),
                })
                return
            }

            const { email, username, fullname, password } = req.body
            const confirmed_hash = generateMD5(process.env.SECRET_HASH_KEY)
            const data = { email, username, fullname, password, confirmed_hash }

            const user = await UserModel.create(data)

            await sendEmail({
                email: email,
                subject: 'Потверждение почты',
                message: `Для того, чтобы потвердить почту перейдите 
                          http://localhost:5003/singup/verify?hash=${confirmed_hash}`,
            })

            res.json({
                status: 'success',
                data: user,
            })
        } catch (error) {
            res.json({
                status: 'error',
                message: error.message,
            })
        }
    }
}

const userController = new UserController()
export default userController
