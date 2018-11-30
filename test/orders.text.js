const fs = require('fs')
const mockfs = require('mock-fs')
const expect = require('expect.js')
const parse = require('csv-parse')

const {
    createCustomer,
    generateCustomers
} = require('../lib/csv')

let content, stream;

content = 'customerId,firstName,lastName\n'
    + '5bfde45518acb93c34570da7,John,Smith'

describe('customer csv generation', () => {
    beforeEach(() => {
        mockfs({
            'orders.csv': '',
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

})