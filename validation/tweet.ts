import { body } from 'express-validator'

const tweetValidation = [
    // text
    body('text').isString().isLength({
        min: 3,
        max: 256,
    })
]

export default tweetValidation
