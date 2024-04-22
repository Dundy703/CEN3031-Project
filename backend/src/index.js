const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const db = require('./queries') // require queries.js which has our queries that run on the PostgreSQL server

app.use(cors());
// specify port for service
// access service APIs from http://localhost:port
const port = 3001

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// register GET method for base url (http://localhost:3000) that gives info for the service
app.get('/', (request, response) => {
  response.json({ info: 'Node.js/express service to communicate with PostgreSQL DB' })
})

// register API methods for GetUsers and CreateUser
app.get('/users/findUser', db.getUsers)    // http://localhost:3000/users/findUser calls queries.getUsers
app.post('/users/createUser', db.createUser)    
app.post('/users/updateUser', db.updateUser)

app.get('/messages/displayMessages', db.showMessages)
app.post('/messages/storeMessage', db.createMessages)

app.get('/orders/searchOrder',db.searchOrder) 
app.post('/orders/createOrder',db.createOrder)

app.get('/items/allItems',db.allItems) 
app.get('/items/categoryList',db.categoryListing)
app.get('/items/specificList',db.specificListing)    
app.get('/items/tagList',db.tagListing) 
app.get('/items/soldList',db.soldListing)
app.post('/items/listItem',db.listItem)
app.post('/items/updateListing',db.updateItem)
app.post('/items/updateSoldFlag',db.updateSoldFlag)






// /users/create gets user information from body in raw format. Example input:
// {
//     "name": "blenm",
//     "password": "password123"
// }

// output which port we're running on
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})