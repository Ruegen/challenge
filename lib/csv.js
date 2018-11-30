const faker = require('faker')
const ObjectId = require('mongodb').ObjectID
const es = require('event-stream')
const fs = require('fs')
const parse = require('csv-parse')
const path = require('path')
const dir = path.join(process.cwd(), 'csv')

const createCustomer = () => {
    return [
        (new ObjectId).toString(), 
        faker.name.firstName(),
        faker.name.lastName()
    ].join(',') + '\n'
}


// code from node.js
// I found for generation this worked
const generateCustomers = (writer, number, callback) => new Promise((resolve,reject) => {
  let i = number;
  
  writer.write('_id,firstName,lastName\n', () => {
    write();
  })

  writer.on('error', (err) => reject(err))

  function write() {
    let ok = true;
    do {
      i--;
      const data = createCustomer()

      if (i === 0) {
        // last time!
        writer.write(data, resolve());
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        ok = writer.write(data);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // had to stop early!
      // write some more once it drains
      writer.once('drain', write);
    }
  }
})


// orders
function createOrder(customerId) {
  return [
          (new ObjectId).toString(), 
          customerId,
          faker.commerce.product(),
          Math.floor(Math.random() * 2) + 1
  ].join(",") + '\n'
}


const generateOrders = (read, write, callback) => new Promise((resolve, reject) => {
  
  write.write('_id,customerId,item,quantity\n', () => {

    // return stream
    read.on('end', () => {
      resolve()
    })

    read.on('error', (err) => {
      reject(err)
    })

    read
      .pipe(parse({columns: true, header: true}))
      .pipe(es.map((customer, cb) => {
        const {_id: customerId} = customer
        cb(null, customerId)
      }))
      .pipe(es.map((customerId, cb) => { 
        cb(null, createOrder(customerId))   
      }))
      .pipe(write)
  })
})

module.exports = {
    createCustomer,
    generateCustomers,
    createOrder,
    generateOrders
}

