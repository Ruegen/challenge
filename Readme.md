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

## streaming libraries
    - request (http)
    - event-stream
    - csv-parse
    - fs
  
## name and item generation
    - faker

## testing
    - mocha (jest seemed to be giving me unknown issues)
    - mock-fs (test fs)
    - expect.js

## database
    - mongodb


# Outcome
* This took me longer than 90 minutes, I would break this up into 2 parts, one for generating 
* csv files and the other for seeding csv files into the db
* Timed this, if the csv files were already generated then this would be less than 90 minutes
* Enjoyed creating this (obsessively) and I had to learn a few things
* Realized event-stream module had a security risk once but it's safe to say that is gone
* Tested this with large file sets
* I know I could have found a tool to generate csv files but I wanted to reuse functions
* I'd have testing on the db (mocks)
* I spent a great deal of time on research (tools) but out of my own desire