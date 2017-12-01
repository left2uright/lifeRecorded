const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.saveGrid = functions.https.onRequest((req, res) => {
    const gridRef = req.body.gridRef
    const gridValue = req.body.gridValue
    admin.database().ref('grids/' + gridRef).set(gridValue)
    res.set({
        'Access-Control-Allow-Origin': 'https://liferecorded-c730f.firebaseapp.com'
    })
    res.status(200).send()
})

exports.loadGrid = functions.https.onRequest((req, res) => {
    const gridRef = req.query.gridRef
    admin.database().ref('grids/' + gridRef).on('value', (snap) => {
        console.log(snap.val())
        res.set({
            'Access-Control-Allow-Origin': 'https://liferecorded-c730f.firebaseapp.com'
        })
        res.status(200).send({grid: snap})
    }, (err) => {console.log('Read failure: ' + err.code)})
})

exports.getNewGridRef = functions.https.onRequest((req, res) => {
    // stub
})

exports.getLeaderboard = functions.https.onRequest((req, res) => {
    // stub
})

exports.getSaveThreshold = functions.https.onRequest((req, res) => {
    // stub
})
