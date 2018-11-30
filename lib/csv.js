const faker = require('faker')
const ObjectId = require('mongodb').ObjectID



const createCustomer = () => {
    return [
        (new ObjectId).toString(), 
        faker.name.firstName(),
        faker.name.lastName()
    ].join(',') + '\n'
}


// code from node.js
// I found for generation this worked
function generateCustomers(writer, number, callback) {
  let i = number;
  writer.write('_id,firstName,lastName\n', () => {
    write();
  })
  function write() {
    let ok = true;
    do {
      i--;
      const data = createCustomer()

      if (i === 0) {
        // last time!
        writer.write(data, callback);
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
}


// orders
function createOrder(customerId) {
  return [
          (new ObjectId).toString(), 
          customerId,
          faker.commerce.product(),
          Math.floor(Math.random() * 2) + 1
  ].join(",") + '\n'
}


module.exports = {
    createCustomer,
    generateCustomers,
    createOrder
}

