const fs = require('fs')
const path = require('path')
const es = require('event-stream')
const ObjectId = require('mongodb').ObjectID
const parse = require('csv-parse')
const dbConnect = require('../connection')

const dir = path.join(process.cwd(), 'csv')

const seedOrders = (stream) => new Promise((resolve, reject) => {
    dbConnect("orders")
        .then(({db, collection: Order, client}) => {
           
            stream.on('end', () => {
                client.close()
                resolve('orders seeded')
            })
            
            stream
            .pipe(parse({columns: true, header: false}))
            .pipe(es.map((order, cb) => {
                // console.log('parsing object')
                cb(null, { 
                    ...order, 
                    _id: new ObjectId(order._id),
                    customerId: new ObjectId(order.customerId)
                })
            }))
            .pipe(es.map((order, cb) => {
                stream.pause()
                // console.log(order.customerId)
                db.collection("customers")
                .findOne({_id: order.customerId})
                .then(record => {
                    if(record) {
                        // console.log('customer found')
                        stream.resume()
                        cb(null, order)
                    } else {
                        // console.log('customer not found, skipped')
                        stream.resume()
                        cb()
                    }
                })
                .catch(err => cb(err))
            }))
            .pipe(es.map((order, cb) => {
                // console.log(order._id)
                stream.resume()
                Order.insertOne(order)
                .then(record => {
                    // console.log('record added')
                    stream.resume()
                    cb(null, order)
                })
                .catch(err => cb(err))
            }))
        })
        .then(() => console.info('db connection'))
        .catch(err => {
            reject(err)
        })
})