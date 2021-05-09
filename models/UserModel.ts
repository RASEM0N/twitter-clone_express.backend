import { Document, model, Schema } from 'mongoose'

export interface UserModelInterface {
    _id?: string
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
        select: false,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    confirmed_hash: {
        required: true,
        type: String,
        select: false,
    },
    about: String,
    website: String,
})

UserSchema.set('toJSON', {
    transform: (_, ret) => {
        delete ret.password
        delete ret.confirmed_hash
        return ret
    },
})


const UserModel = model<UserModelDocumentInterface>('User', UserSchema)
export default UserModel
