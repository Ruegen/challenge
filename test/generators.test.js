const fs = require('fs')
const mockfs = require('mock-fs')
const expect = require('expect.js')
const parse = require('csv-parse')

let content, stream;

content = 'customerId,firstName,lastName\n'
    + '5bfde45518acb93c34570da7,John,Smith'

// return a csv ordered string
describe('customer csv generation', () => {
    beforeEach(() => {
        mockfs({
            'customers.csv': '',
        })
        stream = fs.createWriteStream('customers.csv')
    })

    it('should be a stream object', done => {
        expect(stream.writable).isTrue
        done()
    })
})

