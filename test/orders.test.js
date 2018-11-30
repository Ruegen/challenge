const fs = require('fs')
const mockfs = require('mock-fs')
const expect = require('expect.js')
const parse = require('csv-parse')


const {
    createOrder,
    generateCustomers,
    generateOrders
} = require('../lib/csv')

let content, stream;

content = '_id,customerId,item,quantity\n'
    + '6bfde45333acb93c34570va1,5bfde45518acb93c34570da7,Fridge,2'

describe('customer csv generation', () => {
    beforeEach(() => {
        mockfs({
            'orders.csv': '',
            'customers.csv': ''
        })
        stream = fs.createWriteStream('orders.csv')
        readStream = fs.createReadStream('orders.csv')
    })


    it('should be a stream write object', () => {
        expect(stream.writable).isTrue
    })

    it('should be a stream object', () => {
        expect(readStream.readable).isTrue
    })

    it('create an csv order', done => {
        const order = createOrder('xyz')
        expect(order.match(/,/g).length).to.be(3)
        expect(order[order.length -1]).to.be('\n')
        done()
    })

    it('should parse csv string', done => {
        parse(content.trim(), {columns: true}, (err, records) => {
            const [order] = records
            expect(order.item).to.be('Fridge')
            expect(order.quantity).to.be('2')
            done()
        })
    })

    it('generates orders', async () => {
        let output = []
        const customerStream = fs.createWriteStream('customers.csv')
        await generateCustomers(customerStream, 2)
        const read = fs.createReadStream('customers.csv')
        
        generateOrders(read, stream, () => {
            const orders = fs.createReadStream('orders.csv')

            orders.pipe(parse({columns: true}))
            .on('readable', function() {
                    let record
                    while (record = this.read()) {
                        output.push(record)
                    }
                })
            .on('end', () => {
                    expect(output.length).to.be(2)
                    expect("_id" in output[0]).isTrue
                    expect("item" in output[0]).isTrue
            })
        })
            
    })

})