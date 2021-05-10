import { Request, Response } from 'express'
import TweetModel from '../models/TweetModel'
import { isValidObjectId } from 'mongoose'
import { validationResult } from 'express-validator'
import { UserModelInterface } from '../models/UserModel'

class TweetController {
    getAll = async (_: Request, res: Response): Promise<void> => {
        try {
            const tweets = await TweetModel.find().exec()

            res.json({
                status: 'success',
                data: tweets,
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                errors: error.message,
            })
        }
    }

    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const tweetId = req.params.tweetId

            console.log(tweetId)

            if (!isValidObjectId(tweetId)) {
                res.json({
                    status: 'error',
                    message: 'invalid tweet Id',
                })
                return
            }

            const tweet = await TweetModel.findById(tweetId).exec()

            if (!tweet) {
                res.json({
                    status: 'error',
                    message: 'tweet not found',
                })
                return
            }

            res.json({
                status: 'success',
                data: tweet,
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            })
        }
    }

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

            let { text } = req.body

            const data = {
                text: req.body.text,
                user: (req.user as UserModelInterface)?._id,
            }

            console.log(data)

            const tweet = await TweetModel.create(data)

            res.json({
                status: 'success',
                data: tweet,
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            })
        }
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const tweetId = req.params.tweetId

            if (!isValidObjectId(tweetId)) {
                res.json({
                    status: 'error',
                    message: 'invalid tweet Id',
                })
                return
            }

            const tweet = await TweetModel.findById(tweetId)

            if (!tweet) {
                res.json({
                    status: 'error',
                    message: 'Tweet not found',
                })
                return
            }

            if (tweet.user.toString() !== (req.user as UserModelInterface)._id.toString()) {
                res.json({
                    status: 'error',
                    message: "User don't have permission on a delete this",
                })
                return
            }

            await tweet.delete()

            res.json({
                status: 'success',
                message: `Tweet with id ${tweetId} was deleted `,
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            })
        }
    }
}

export default new TweetController()
