const PAGE_URL = process.env.NODE_ENV === 'production'
? 'placeholder'
: 'http://localhost:4004';


const MONGO_URI = process.env.NODE_ENV === 'production'
? 'MONGO_URI_PROD'
: 'MONGO_URI_TEST';

module.exports = { PAGE_URL, MONGO_URI };