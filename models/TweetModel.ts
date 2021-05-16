import { Document, model, Schema } from 'mongoose'

export interface TweetModelInterface {
    _id?: string
    text: string
    user: string
}

type TweetModelDocumentInterface = TweetModelInterface & Document

const TweetSchema = new Schema<TweetModelDocumentInterface>({
    text: {
        required: true,
        type: String,
    },
    user: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true
})

const TweetModel = model<TweetModelDocumentInterface>('Tweet', TweetSchema)
export default TweetModel
