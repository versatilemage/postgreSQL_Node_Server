const Cors = require("cors")
const bcrypt = require("bcrypt")
// const uuidv4 = require("uuid")
const jwt = require("jsonwebtoken")
const {isEmail, isLength} = require("validator")
const initMiddleware = require("../../lib/init-middleware.js")
// import {User} from '../../schema/user.js'
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

const signin = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!isEmail(email)){
            console.log({message: "Email should be a valid email address"})
            return res.status(422).send({error: "Email should be a valid email address", message: "Email should be a valid email address"})
        }

        const user = await db.users.findOne({
            where: { email: email }
        })

        if(!user) {
            console.log({message: "User account does not exist"})
            return res.status(404).send({error: "User account does not exist", message: "User account does not exist"});
        }

        if(!user.active){
            console.log({error: "This account is temporarily disabled, please contact the support email"})
            return res.status(404).send({error: "This account is temporarily disabled, please contact the support email", message: "This account is temporarily disabled, please contact the support email"});
        }

        const passwordsMatch = await bcrypt.compare(password, user.password)
        console.log(passwordsMatch)
        if (passwordsMatch){
            const token = jwt.sign({ userId: user.id}, process.env.JWT_SECRET, {expiresIn: '7d'});
            console.log({token: token})
            res.status(200).send(token);
        } else {
            console.log({error: "Password is not correct"})
            res.status(401).send({error: "Password is not correct", message: "Password is not correct"});
        }

    } catch (error) {
        console.log({message: "Sign in failed catch"})
        res.status(500).send({error: error, message: "Sign in failed catch"})
    }
}

module.exports = signin
