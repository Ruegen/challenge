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
const seedOrders = require('./db/seeds/orders')

async function main() {
        const customersCSVPath = path.join(dir, 'customers.csv')
        const ordersCSVPath = path.join(dir, 'orders.csv')
        
        const customers = fs.createWriteStream(customersCSVPath)
        await generateCustomers(customers, 10)
        
        const customersStream = fs.createReadStream(customersCSVPath)
        const orders = fs.createWriteStream(ordersCSVPath)
        await generateOrders(customersStream, orders)


        // haven't mocked this for testing
        const steamread = fs.createReadStream(customersCSVPath)
        console.log(await seedCustomers(steamread))
       
        // at this point you should have uploaded the csv file to a host to fetch
        const url = 'https://raw.githubusercontent.com/Ruegen/orders/master/orders.csv'
        const stream = fs.createReadStream(ordersCSVPath)
        //request(url) 
        

        // console.log(await seedOrders(stream))


}

main()