const express = require('express')
const FaceBook = express.Router()
const FB = require('fb');
const request = require('request-promise')
FaceBook.post('/um-fb-info', (req, res) => {
        const token = req.headers['x-access-token']

        FB.setAccessToken(token);
        FB.api('/me?fields=id,name', 'POST', function(response) {
            if (response) {
                res.json({ status: 200, data: response })
            }
        });
    })
    // fb friends lists
FaceBook.post('/um-fb-friends', (req, res) => {
    const token = req.headers['x-access-token']

    FB.setAccessToken(token);
    FB.api('/me/friends', 'GET', function(response) {
        if (response) {
            res.json({ status: 200, data: response })
        }
    });
})

// get followers
FaceBook.post('/um-fb-followers', (req, res) => {
        const token = req.headers['x-access-token']

        FB.setAccessToken(token);
        FB.api('/me?fields=followers_count', 'GET', function(response) {
            if (response) {
                res.json({ status: 200, data: response })
            }
        });
    })
    // Logout api
    // get followers
FaceBook.post('/um-fb-single-message', (req, res) => {
    const token = req.headers['x-access-token']

    const options = {
        method: 'POST',
        uri: 'https://graph.facebook.com/v12.0/me/messages?access_token=' + token,
        body: {
            "messaging_type": "RESPONSE",
            "recipient": {
                "id": "6465244976879068"
            },
            "message": {
                "text": "hello, world!"
            }
        },
        json: true,
        headers: {
            'Content-Type': 'application/json',
        }
    }
    request(options).then(function(response) {
            res.status(200).json(response);
        })
        .catch(function(err) {
            res.status(404).json(err);
        })

})


// get followers
FaceBook.get('/um-fb-get-message', (req, res) => {
    const token = req.headers['x-access-token']
    FB.setAccessToken(token);
    FB.api(
        '/me/conversations',
        'GET', { "fields": "messages,name,senders" },
        function(response) {
            res.status(200).json(response);
        }
    );

})
FaceBook.get('*', (req, res) => {
    res.status(404).json({ status: 0, message: 'Incorrect Request' });
})

module.exports = FaceBook