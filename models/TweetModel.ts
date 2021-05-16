import { Document, model, Schema } from 'mongoose'
import { UserModelInterface } from './UserModel'

export interface TweetModelInterface {
    _id?: string
    text: string
    user: UserModelInterface
    image?: string
}

type TweetModelDocumentInterface = TweetModelInterface & Document

const TweetSchema = new Schema<TweetModelDocumentInterface>(
    {
        text: {
            required: true,
            type: String,
        },
        user: {
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        image: String,
    },
    {
        timestamps: true,
    }
)

const TweetModel = model<TweetModelDocumentInterface>('Tweet', TweetSchema)
export default TweetModel
