Setup

1. generate csv customers
    1. generate a customer
    2. generate many customers
2. generate csv bookings
    1. obtain a customer
    2. generate a random booking off customer
3. seed customers into db
4. seed bookings into db
    1. bookings have to have a customer in db

Files generated and received should be as a stream

# streaming libraries
    - request (http)
    - event-stream
    - csv-parse
    - fs
  
# name and item generation
    - faker

# testing
    - mocha (jest seemed to be giving me unknown issues)
    - mock-fs (test fs)
    - expect.js

# database
    - mongodb