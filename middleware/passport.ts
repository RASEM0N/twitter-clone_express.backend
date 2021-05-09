import * as passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'
import UserModel, { UserModelInterface } from '../models/UserModel'
import { generateMD5 } from '../utils/generateHash'
import { token } from 'morgan'

const invalidUserResponse = {
    success: 'error',
    message: 'Invalid username or password',
}



passport.use(
    new LocalStrategy(
        async (username, password, done): Promise<void> => {
            try {
                const user = await UserModel.findOne({
                    $or: [{ email: username }, { username }],
                })
                    .select('+password')
                    .exec()

                if (!user) {
                    done(null, false)
                    return
                }

                if (user.password !== generateMD5(password + process.env.SECRET_HASH_KEY)) {
                    return done(null, false)
                }

                done(null, user)
            } catch (error) {
                done(error.message, false)
            }
        }
    )
)

passport.use(
    new JWTStrategy(
        {
            secretOrKey: process.env.JWT_AUTHORIZE_KEY,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        async (payload, done) => {
            try {
                const user = await UserModel.findById(payload.userId)

                if (!user){
                    done(null, false)
                }

                done(null, user)
            } catch (error) {
                done(error.message)
            }
        }
    )
)

passport.serializeUser((user: UserModelInterface, done) => {
    done(null, user._id)
})
passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err, user) => {
        done(err, user)
    })
})

export { passport }
