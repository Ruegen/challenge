const fs = require('fs')
const mockfs = require('mock-fs')
const expect = require('expect.js')
const parse = require('csv-parse')

// functions
const {
    createCustomer,
    generateCustomers
} = require('../lib/csv')

let content, stream;

content = '_id,firstName,lastName\n'
    + '5bfde45518acb93c34570da7,John,Smith'

// return a csv ordered string
describe('customer csv generation', () => {
    beforeEach(() => {
        mockfs({
            'customers.csv': '',
        })
        stream = fs.createWriteStream('customers.csv')
        readStream = fs.createReadStream('customers.csv')
    })

    it('should be a stream object', done => {
        expect(stream.writable).isTrue
        done()
    })

    // test if what I have to test with is correct
    it('should parse csv string', done => {
        parse(content.trim(), {columns: true}, (err, records) => {
            const [customer] = records
            expect(customer.firstName).to.be('John')
            expect(customer.lastName).to.be('Smith')
            done()
        })
    })

    it('should generate a customer string', () => {
        const customer = createCustomer()
        expect(customer.match(/,/g).length).to.be(2)
        expect(customer[customer.length -1]).to.be('\n')
    })

    it('should be a write stream', () => {
        expect(readStream.readable).isTrue
    })

    it('should generate n customers', async () => {
        const output = []
        await generateCustomers(stream, 2)
            
        readStream.pipe(parse({columns: true}))
            
        .on('readable', function() {
                let record
                while (record = this.read()) {
                    output.push(record)
                }
        })

        .on('end', () => {
            expect(output.length).to.be(2)
            expect("_id" in output[0]).isTrue
        })
        
    })


})

