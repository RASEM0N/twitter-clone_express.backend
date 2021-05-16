import { Request, Response } from 'express'
import cloudinary from '../core/cloudinary'
import UserModel, { UserModelInterface } from '../models/UserModel'

class UploadFIleController {
    upload = async (req: Request, res: Response): Promise<void> => {
        const userId = (req.user as UserModelInterface)._id
        const file = req.file

        await cloudinary.v2.uploader
            .upload_stream(
                {
                    resouce_type: 'auto',
                },
                async (error, result) => {
                    if (error || !result) {
                        return res.status(500).json({ status: 'error', message: 'Error uploading' })
                    }

                    await UserModel.findByIdAndUpdate(userId, {
                        avatarUrl: result.url,
                    })
                    res.status(201).json({ status: 'success' })
                }
            )
            .end(file.buffer)
    }
}

export default new UploadFIleController()
