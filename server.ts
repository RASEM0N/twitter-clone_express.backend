import * as express from 'express'
import * as morgan from 'morgan'
import * as dotenv from 'dotenv'

import { userController } from './controllers/UserController'
import registerValidation from './validation/register'
import connectDB from './core/db'

dotenv.config({ path: './.env' })
connectDB()

const app = express()

// --- MIDDLEWARE ---
app.use(express.json())
app.use(morgan('dev'))

app.get('/users', userController.index)
app.post('/users', registerValidation, userController.index)

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
    console.log(`SERVER RUNNING on the port ${PORT}`)
})

process.on('unhandledRejection', (err, promise) => {
    console.log(`---- Error ----`)
    console.log(err)

    server.close(() => process.exit(1))
})