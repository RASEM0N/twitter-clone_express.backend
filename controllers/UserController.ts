import { Request, Response } from 'express'
import UserModel from '../models/UserModel'
import { validationResult } from 'express-validator'
import { generateMD5 } from '../utils/generateHash'
import sendEmail from '../utils/sendEmail'

class UserController {

    /**
     * Get users
     * @route       GET /users
     * @access      Public
     */
    getAll = async (_: Request, res: Response): Promise<void> => {
        try {
            const users = await UserModel.find().exec()

            res.json({
                status: 'success',
                data: users,
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                errors: error.message,
            })
        }
    }

    /**
     * Get user by id
     * @route       GET /users/:userId
     * @params      userid
     * @access      Public
     */
    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.userId

            const user = await UserModel.findById(userId).exec()

            if (!user){
                res.json({
                    status: 'error',
                    message: 'user not found'
                })
                return
            }

            res.json({
                status: 'success',
                data: user,
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            })
        }
    }

    /**
     * Create new user
     * @route       POST /auth/register
     * @access      Public
     * @body        email, username, fullname, password & password2
     */
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(400).json({
                    status: 'error',
                    message: errors.array(),
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
                          http://localhost:5003/verify/${confirmed_hash}`,
            })

            res.json({
                status: 'success',
                data: user,
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            })
        }
    }

    /**
     * Verify user
     * @access      Public
     * @route       PUT /auth/verify/:hash
     * @params      hash
     */
    verify = async (req: Request, res: Response): Promise<void> => {
        try {
            const hash = req.params.hash

            if (!hash) {
                res.json({
                    status: 'error',
                    message: 'please use with a hash',
                })
                return
            }

            const user = await UserModel.findOne({
                confirmed_hash: hash,
            })


            if (!user) {
                res.json({
                    status: 'error',
                    message: 'user not found',
                })
                return
            }

            await user.update({
                confirmed: true
            })

            res.json({
                status: 'success',
                message: 'User confirmed',
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            })
        }
    }

}

export default new UserController()
