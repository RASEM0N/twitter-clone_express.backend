import * as express from 'express'
import * as morgan from 'morgan'
import * as dotenv from 'dotenv'

dotenv.config({ path: './.env.dev' })

import userController from './controllers/UserController'
import tweetController from './controllers/TweetController'
import registerValidation from './validation/register'
import tweetValidation from './validation/tweet'
import connectDB from './core/db'
import { passport } from './middleware/passport'

connectDB()

const app = express()

// --- MIDDLEWARE ---
app.use(morgan('dev'))
app.use(express.json())
app.use(passport.initialize())

// --- USER ROUTES --- //
app.get('/users', userController.getAll)
app.get('/users/:userId', userController.getById)

// --- AUTHORIZATION ROUTES ---
app.get('/auth/me', passport.authenticate('jwt'), userController.getMe)
app.post('/auth/register', registerValidation, userController.create)
app.post('/auth/login', passport.authenticate('local'), userController.login)
app.get('/auth/verify/:hash', userController.verify)

// --- TWEET ROUTES ---
app.post('/tweets', passport.authenticate('jwt'), tweetValidation, tweetController.create)
app.delete('/tweets/:tweetId', passport.authenticate('jwt'), tweetController.delete)
app.put('/tweets/:tweetId', passport.authenticate('jwt'), tweetValidation, tweetController.update)
app.get('/tweets', tweetController.getAll)
app.get('/tweets/:tweetId', tweetController.getById)

// --- SETTINGS ---
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
    console.log(`SERVER RUNNING on the port ${PORT}`)
})

process.on('unhandledRejection', (err, promise) => {
    console.log(err)
    server.close(() => process.exit(1))
})
