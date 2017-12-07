const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.leaderBoardInsert = functions.https.onRequest((req,res) => {
    console.log(JSON.stringify(req.body,null,4))
    let db = admin.database()
    let dbRef = db.ref('leaderboard')
    let score = parseInt(req.body.score)
    score = Number.isInteger(score) ? score : 0
    const ref = req.body.ref
    const grid = req.body.grid
    let newLB
    let lbPromise = new Promise((resolve, reject) => {

        dbRef.orderByValue().once('value', (snapshot) => {
            resolve(snapshot)
        })
    }).then((lb) => {
        let isInserted = false
        let orderedLB = []
        let currentIndex = 0
        lb.forEach((entry) => {
            let lbEntry = {}
            lbEntry[`${entry.key}`] = entry.val()
            orderedLB.push(lbEntry)
        })

        orderedLB.reverse()

        // handle record insertion
        orderedLB.forEach((entry, index) => {
            let recordRef = Object.keys(entry)[0]
            if ((entry[recordRef] <= score) && !isInserted) {
                let newEntry = {}
                newEntry[ref] = score
                orderedLB.splice(index, 0, newEntry)
                if(index < 10) {
                    isInserted = true
                }
            }
        })

        if (isInserted) {
            let gridRef = db.ref(`grids/${ref}`).set(grid)
        }

        let orderedLBObject = {}
        orderedLB = orderedLB.slice(0,10)
        orderedLB.forEach((entry) => {
            const key = Object.keys(entry)[0]
            orderedLBObject[key] = entry[key]
        })

        dbRef.set(orderedLBObject)

        res.set({
            'Access-Control-Allow-Origin': 'https://liferecorded-c730f.firebaseapp.com',
            'Content-Type': 'text/json'
        })
        res.status(200).send({'isSaved':isInserted})
    })
})

exports.loadGrid = functions.https.onRequest((req, res) => {
    const gridRef = req.query.gridRef
    admin.database().ref('grids/' + gridRef).once('value', (snap) => {
        let loadedGrid = []
        snap.forEach((row) => {
            let parsedRow = []
            row.val().forEach((cell) => {
                parsedRow.push(parseInt(cell))
            })
            loadedGrid.push(parsedRow)
        })
        res.set({
            'Access-Control-Allow-Origin': 'https://liferecorded-c730f.firebaseapp.com'
        })
        res.status(200).send({grid: loadedGrid})
    }, (err) => {console.log('Read failure: ' + err.code)})
})

exports.getGridRef = functions.https.onRequest((req, res) => {

    let isUnique = false
    let newRef
    let db = admin.database()
    let dbRef = db.ref('leaderboard')
    dbRef.once('value', (snapshot) => {

        while (!isUnique) {
            // newRef = Math.floor(Math.random() * 10000000000)
            newRef = 'yxxxxxxxxx'
            newRef = newRef.replace(/x/g, () => {return Math.floor(Math.random() * 10)})
            newRef = newRef.replace(/y/, Math.floor(Math.random() * 9) + 1)
            newRef = parseInt(newRef)
            snapshot.forEach((item) => {
                if (item.key !== newRef) {
                    isUnique = true
                }
            })
        }

        res.set({
            'Access-Control-Allow-Origin': 'https://liferecorded-c730f.firebaseapp.com',
            'Content-Type': 'text/plain'
        })
        res.status(200).send(newRef.toString())
    })
})

exports.getLeaderboard = functions.https.onRequest((req, res) => {
    let db = admin.database()
    let dbRef = db.ref('leaderboard')
    let lbArray = []
    dbRef.orderByValue().once('value', (snapshot) => {
        snapshot.forEach((item) => {
            let itemObj = {}
            itemObj[item.key] = item.val()
            lbArray.push(itemObj)
        })

        lbArray.reverse()

        let outputString = '<table id="leaderboard" class="table text-left">'
        outputString += '<th>Rank</th><th>Game Ref</th><th>Score</th>'
        lbArray.forEach((obj, index) => {
            let key = Object.keys(obj)[0]
            outputString += `<tr><td>${index + 1}</td><td>${key}</td><td>${obj[key]}</td></tr>`
        })
        outputString += '</table>'

        res.set({
            'Access-Control-Allow-Origin': 'https://liferecorded-c730f.firebaseapp.com',
            'Content-Type': 'text/html'
        })
        res.status(200).send(outputString)
    })
})


const validateSaveData = function(gridRef, gridValue) {

    let isValid = true
    const gridValueString = gridValue
        .map((row) => {
            return row.join('')
        })
        .join('')

    if (!/^[0-9]{10}$/.test(gridRef)) {
        isValid = false
    }

    if (!/[01]*/.test(gridValueString)) {
        isValid = false
    }

    return isValid
}
