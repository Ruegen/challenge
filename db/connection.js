const {MongoClient}  = require('mongodb')
const uri = 'mongodb://localhost:27017/'

const mongodb = (collectionName) => new Promise((resolve, reject) => {

    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {

        if(err) reject(err)

        try {
            const db = client.db("company")
            db.createCollection(collectionName)
            .then(collection => resolve({db, collection, client}))
            .catch(err => {
                client.close()
                throw err
            })
        } catch(err) {
            client.close()
            reject(err)
        }
    })
}) 

module.exports = mongodb
