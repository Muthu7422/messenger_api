const express = require('express')
const Webhook = express.Router()
const WebhookController = require("../controller/webhookController")

Webhook.get("/", WebhookController.getWebhook)
Webhook.post("/post", WebhookController.postWebhook)


module.exports = Webhook