const express = require('express')
const WhatsApp = express.Router()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

WhatsApp.post('/um-wp-text-single-message', (req, res) => {
    // console.log(req.body);
    client.messages
        .create({
            from: 'whatsapp:' + req.body.from,
            to: 'whatsapp:' + req.body.to,
            body: req.body.message,
        })
        .then(message => {
            res.json({ status: 200, message: message })
        }).catch(err => {
            res.json({ status: 404, message: err })
        });
})
WhatsApp.get('*', (req, res) => {
    res.status(404).json({ status: 0, message: 'Incorrect Request' });
})
module.exports = WhatsApp