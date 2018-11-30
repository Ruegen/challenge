const fs = require('fs')
const path = require('path')
const es = require('event-stream')
const ObjectId = require('mongodb').ObjectID
const dir = path.join(process.cwd(), 'csv')
const parse = require('csv-parse')
const dbConnect = require('../connection')


const seedCustomers = () => new Promise((resolve, reject) => {
    
const customersStream = fs.createReadStream(path.join(dir, 'customers.csv'))

dbConnect("customers")
    .then(({db, collection: Customer, client}) => {
        customersStream.on('end', () => {
            client.close()
            resolve('seed completed')
        })
        
        // parse csv
        customersStream
        .pipe(parse({columns: true, header: false}))

        .pipe(es.map((customer, cb) => {
            cb(null, {...customer, _id: new ObjectId(customer._id) })
        }))

        // check if user exists in db
        .pipe(es.map((customer, cb) => {
            customersStream.pause()
            Customer.findOne({_id: customer._id})
                .then(record => {
                    
                    if(record) {
                        customersStream.resume()
                        cb()
                    } else {
                        customersStream.resume()
                        cb(null, customer)
                    }
                })
                .catch(err => reject(err))
        }))
        // add customer to db
        .pipe(es.map((customer, cb) => {
            customersStream.pause()
                Customer.insertOne(customer)
                .then((record) => {
                    if(record) {
                        console.log('added customer', record)
                    }
                    customersStream.resume()
                    cb(null, customer)
                })
                .catch(err => reject(err))
        }))
    })
    .then(() => console.log('db connection'))
    .catch(err => {
        reject(err)
    })
})

module.exports = seedCustomers