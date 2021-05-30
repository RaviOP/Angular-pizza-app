const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req._id = decoded._id
        next()
    } catch (error) {
        res.status(401).json({ message: "You are Not Authenticated" })
    }
}

module.exports = auth