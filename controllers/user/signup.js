const Cors = require("cors")
const bcrypt = require("bcrypt")
const { v4: uuidv4 } = require("uuid")
const jwt = require("jsonwebtoken")
const {isEmail, isLength} = require("validator")
const initMiddleware = require("../../lib/init-middleware.js")
const db = require("../../schema/index.js")
require("dotenv").config();

// Initialize the cors middleware
const cors = initMiddleware(
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    Cors({
        // Only allow requests with GET, POST and OPTIONS
        methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'],
    })
)

const signup = async (req, res) => {
    // await cors(req, res)
    const confirmToken = uuidv4()
    let { name, email, password, confirmPassword } = req.body
    console.log(name, email, password, confirmPassword)
    try {
        if (!isLength(name, {min: 3})) {
            return res.status(422).send("The name should be a minimum of Three characters long")
        } else if (!isEmail(email)){
            return res.status(422).send("Email should be a valid email address")
        } else if (!isLength(password, {min: 6})){
            return res.status(422).send("Password should be minimum of Six characters long")
        } else if (password != confirmPassword){
            return res.status(422).send("Password doesn't match")
        }

        // Check if user with that email if already exists
        const user = await db.users.findOne({
            where: { email: email }
        })

        if(user){
            return res.status(422).send(`User already exist with email ${email}`)
        }

        // Encrypt password with bcrypt
        const passwordHash = await bcrypt.hash(password, 10)
        res.send({
            name, 
            email, 
            password: passwordHash,
            emailResetToken: confirmToken
        })

        const newUser = await db.users.create({
            name, 
            email, 
            password: passwordHash,
            emailResetToken: confirmToken
        })

        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {expiresIn: '7d'})

    } catch (error) {
        console.error(error)
        // res.status(500).send("Error in account signup. Please try again.")
    }
}

module.exports = signup
