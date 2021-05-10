import * as jwt from 'jsonwebtoken'

export const createTokenByUserId = (
    _id: string,
    key = process.env.JWT_AUTHORIZE_KEY,
    expiresIn = '40min',
): string => {
    return jwt.sign({ userId: _id }, key, {
        expiresIn,
    })
}
