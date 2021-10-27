const express = require('express')
const jwt = require('jsonwebtoken')
const Auth = express.Router()
require('dotenv').config()
    // login api
Auth.post('/login', (req, res) => {
        try {
            const postData = req.body
            const body = {
                "username": postData.username,
                "password": postData.password
            }
            const access = jwt.sign(body, process.env.ACCESS, { expiresIn: process.env.ACCESSLIFE })
            const refreshToken = jwt.sign(body, process.env.REFRESH, { expiresIn: process.env.REFRESHLIFE })
            const response = {
                result: true,
                "status": 200,
                "accessToken": access,
                "refreshToken": refreshToken
            }
            res.json(response)
        } catch (e) {
            return res.json({ result: false, status: 500, message: "Internal server error" })
        }
    })
    // Refresh api
Auth.get('/refresh', (req, res) => {

        try {
            const token = req.headers['x-access-token']
                // decode token
            if (token) {
                // verifies secret and checks exp
                jwt.verify(token, process.env.REFRESH, function(err, decoded) {
                    if (err) {
                        return res.status(401).json({ result: false, "error": err, "message": 'Token expired' });
                    } else {

                        const body = {
                            "username": decoded.username,
                            "password": decoded.password
                        }
                        const refreshToken = jwt.sign(body, process.env.REFRESH, { expiresIn: process.env.REFRESHLIFE })
                        const access = jwt.sign(body, process.env.ACCESS, { expiresIn: process.env.ACCESSLIFE })
                        const response = {
                            result: true,
                            "status": 200,
                            "accessToken": access,
                            "refreshToken": refreshToken
                        }
                        res.json(response)
                    }
                });
            } else {
                // if there is no token
                // return an error
                return res.status(403).send({
                    "error": false,
                    "message": 'No token provided.'
                });
            }
        } catch (error) {
            return res.json({ result: false, status: 500, message: "Internal server error", data: error })
        }
    })
    // end
module.exports = Auth