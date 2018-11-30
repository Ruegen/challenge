const path = require('path')
const fs = require('fs')
const parse = require('csv-parse')
const ObjectId = require('mongodb').ObjectID
const dir = path.join(process.cwd(), 'csv')
const {
    generateCustomers,
    generateOrders,
} = require('./lib/csv')

const seedCustomers = require('./db/seeds/customers')

async function main() {
        const customersCSVPath = path.join(dir, 'customers.csv')
        const ordersCSVPath = path.join(dir, 'orders.csv')
        
        const customers = fs.createWriteStream(customersCSVPath)
        await generateCustomers(customers, 2)
        
        const customersStream = fs.createReadStream(customersCSVPath)
        const orders = fs.createWriteStream(ordersCSVPath)
        await generateOrders(customersStream, orders)

        const message = await seedCustomers()

        console.log(message)

        

}

main()