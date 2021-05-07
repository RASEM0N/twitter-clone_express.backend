import * as express from 'express'

const app = express()

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
    console.log(`SERVER RUNNING on the port ${PORT}`)
})