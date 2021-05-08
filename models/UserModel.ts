import { Document, model, Schema } from 'mongoose'

interface UserModelInterface {
    email: string
    username: string
    fullname: string
    password: string
    confirmed_hash: string
    confirmed: boolean

    location?: string
    about?: string
    website?: string
}

type UserModelDocumentInterface = UserModelInterface & Document

const UserSchema = new Schema<UserModelDocumentInterface>({
    email: {
        unique: true,
        required: true,
        type: String,
    },
    fullname: {
        required: true,
        type: String,
    },
    username: {
        unique: true,
        required: true,
        type: String,
    },
    location: String,
    password: {
        required: true,
        type: String,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    confirmed_hash: {
        required: true,
        type: String,
    },
    about: String,
    website: String,
})

const UserModel = model<UserModelDocumentInterface>('User', UserSchema)
export default UserModel
