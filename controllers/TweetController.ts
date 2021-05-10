import { Request, Response } from 'express'


class TweetController {
    getAll = async (_: Request, res: Response): Promise<void> => {}

    getById = async (req: Request, res: Response): Promise<void> => {}

    create = async (req: Request, res: Response): Promise<void> => {}

    delete = async (req: Request, res: Response): Promise<void> => {}
}

export default new TweetController()
