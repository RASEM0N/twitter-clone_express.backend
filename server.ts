import * as express from 'express'
import * as morgan from 'morgan'
import * as dotenv from 'dotenv'

import userController from './controllers/UserController'
import registerValidation from './validation/register'
import connectDB from './core/db'

dotenv.config({ path: './.env.dev' })
connectDB()

const app = express()

// --- MIDDLEWARE ---
app.use(morgan('dev'))
app.use(express.json())

app.get('/users', userController.getAll)
app.get('/users/:userId', userController.getById)
app.post('/auth/register', registerValidation, userController.create)
app.get('/auth/verify/:hash', userController.verify)

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
    console.log(`SERVER RUNNING on the port ${PORT}`)
})

process.on('unhandledRejection', (err, promise) => {
    console.log(err)
    server.close(() => process.exit(1))
})
