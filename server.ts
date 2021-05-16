import * as express from 'express'
import * as morgan from 'morgan'
import * as dotenv from 'dotenv'
import * as multer from 'multer'

dotenv.config({ path: './.env.dev' })

import userController from './controllers/UserController'
import tweetController from './controllers/TweetController'
import registerValidation from './validation/register'
import tweetValidation from './validation/tweet'
import connectDB from './core/db'
import { passport } from './middleware/passport'
import uploadFIleController from './controllers/UploadFIleController'

connectDB()

const app = express()
const storage = multer.memoryStorage()
// multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, __dirname + '/uploads')
//     },
//     filename: (req, file, cb) => {
//         const ext = file.originalname.split('.').pop()
//         cb(null, `image-${Date.now()}.${ext}`)
//     },
// })
const upload = multer({ storage })

// --- MIDDLEWARE ---
app.use(morgan('dev'))
app.use(express.json())
app.use(passport.initialize())

// --- USER ROUTES --- //
app.get('/users', userController.getAll)
app.get('/users/:userId', userController.getById)
app.post(
    '/users/upload',
    passport.authenticate('jwt'),
    upload.single('avatar'),
    uploadFIleController.uploadUserAvatar
)

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
app.post(
    '/upload',
    passport.authenticate('jwt'),
    upload.single('image'),
    uploadFIleController.upload
)

// --- SETTINGS ---
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
    console.log(`SERVER RUNNING on the port ${PORT}`)
})

process.on('unhandledRejection', (err, promise) => {
    console.log(err)
    server.close(() => process.exit(1))
})
