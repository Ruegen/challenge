
const createCustomer = () => {
    return [
        'id',
        'first',
        'last'
    ].join(',') + '\n'
}

module.exports = {
    createCustomer
}