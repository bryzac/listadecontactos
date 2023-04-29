const PAGE_URL = process.env.NODE_ENV === 'production'
? 'https://lista-de-contactos-42bv.onrender.com'
: 'http://localhost:4004';


const MONGO_URI = process.env.NODE_ENV === 'production'
? process.env.MONGO_URI_PROD
: process.env.MONGO_URI_TEST;

module.exports = { PAGE_URL, MONGO_URI };