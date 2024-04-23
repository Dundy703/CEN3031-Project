const Pool = require('pg').Pool
const fs = require('fs');

// postgres server connection information
const pool = new Pool({
  user: 'minglemart',
  host: 'minglemart-1.cluwmmwsu5li.us-east-2.rds.amazonaws.com',
  database: 'MingleMart',
  password: 'MingleMart123!',
  port: 5432,
  ssl: { 
    require: true,
    rejectUnauthorized: true,
    ca: fs.readFileSync('us-east-2-bundle.pem').toString(), 
  } 
})

// method to get all users in the DB table
const getUsers = (request, response) => {
    // execute the SELECT query, query results are put into results
    const {userEmail} = request.body;
    pool.query('SELECT * FROM "Users" WHERE "UserEmail" = ($1)', [userEmail], (error, results) => {
      // if there's an error (query typo, server connection issue, etc), throw (will crash the service)
      if (error) {
        throw error
      }
      // return the query results
      // HTTP code 200 = "success" for GET methods
      // results.rows gives the actual query data
      response.status(200).json(results.rows)
    })
  }
const createUser = (request, response) => {
      // get data to insert from the request body
      const { imageData, userEmail, phoneNumber, userUsername,userPassword,userFirstName,userMiddleName,userLastName,userAddressLine1,userAddressLine2,userState,userCity,userZipCode} = request.body;
      // execute the INSERT query, get the results back so we can confirm
      pool.query('INSERT INTO "Image" ("ImageData", "UserEmail") VALUES ($1,$2)',[imageData, userEmail], (error, results) => {
        if (error) {
          throw error
        }
        pool.query('INSERT INTO "Users" ("UserEmail", "UserPhoneNumber","UserUsername","UserPassword","UserFirstName", "UserMiddleName","UserLastName","UserAddressLine1","UserAddressLine2","UserState","UserCity","UserZipCode","UserProfilePictureID") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,(SELECT "Image_ID" FROM "Image" WHERE "UserEmail" = ($1)))', [userEmail, phoneNumber, userUsername,userPassword,userFirstName,userMiddleName,userLastName,userAddressLine1,userAddressLine2,userState,userCity,userZipCode], (error,results) => {
          if (error) {
            throw error
          }
          response.status(201).send(`User added`)
      })
    })
  }
const updateUser = (request, response) => {
  const { imageData, userEmail, phoneNumber, userUsername,userPassword,userFirstName,userMiddleName,userLastName,userAddressLine1,userAddressLine2,userState,userCity,userZipCode} = request.body;
  pool.query('UPDATE "Image"  SET "ImageData" = ($1) WHERE "UserEmail" = ($2)',[imageData, userEmail], (error, results) => {
    if (error) {
      throw error
    }
    pool.query('UPDATE "Users" SET "UserEmail" = ($1), "UserPhoneNumber" = ($2), "UserUsername" = ($3),"UserPassword" = ($4),"UserFirstName" = ($5), "UserMiddleName" = ($6),"UserLastName" = ($7),"UserAddressLine1" = ($8),"UserAddressLine2" = ($9),"UserState" = ($10),"UserCity" = ($11),"UserZipCode" = ($12),"UserProfilePictureID" = (SELECT "Image_ID" FROM "Image" WHERE "UserEmail" = ($1)) WHERE "UserEmail" = ($1)', [userEmail, phoneNumber, userUsername,userPassword,userFirstName,userMiddleName,userLastName,userAddressLine1,userAddressLine2,userState,userCity,userZipCode], (error,results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User updated`)
    })
  })
  }
const showMessages = (request, response) => {
    const {senderEmail, receiverEmail} = request.body;
    pool.query('SELECT * FROM "Messages" WHERE "Receiver_ID" = (SELECT "User_ID" FROM "Users" WHERE "UserEmail" = ($2)) AND "Sender_ID" = (SELECT "User_ID" FROM "Users" WHERE "UserEmail" = ($1))', [senderEmail, receiverEmail], (error, results) => {
      if (error) {
        throw error
      }
        response.status(200).json(results.rows)
      })
  }
const createMessages = (request, response) => {
  const {senderEmail, receiverEmail, messageContent} = request.body;
  pool.query('INSERT INTO "Messages" ("Receiver_ID", "Sender_ID", "MessageContent") VALUES ((SELECT "User_ID" FROM "Users" WHERE "UserEmail" = ($2)),(SELECT "User_ID" FROM "Users" WHERE "UserEmail" = ($1)),$3)', [senderEmail, receiverEmail, messageContent], (error,results) => {
    if (error) {
      throw error
    }
      response.status(200).json(results.rows)
    })
  }
const listItem = (request, response) => {
  const {itemName, itemDescription, itemCategory,imageData,itemTags} = request.body;
  pool.query('INSERT INTO "Image" ("ImageData", "ItemName") VALUES ($1,$2)',[imageData, itemName], (error, results) => {
    if (error) {
      throw error
    }
    pool.query('INSERT INTO "Items" ("ItemName", "ItemDescription","ItemCategory","ItemImageID","ItemTags") VALUES ($1,$2,$3,(SELECT "Image_ID" FROM "Image" WHERE "ItemName" = ($1)),$4)', [itemName, itemDescription, itemCategory,itemTags], (error,results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  })
  }
const allItems = (request, response) => {
  pool.query('SELECT * FROM "Items"', (error, results) => {
    if (error) {
      throw error
    }
      response.status(200).json(results.rows)
    })
}
//How to get both the image info and item info in one query
const categoryListing = (request, response) => {
  // execute the SELECT query, query results are put into results
  const {itemCategory} = request.body;
  pool.query('SELECT * FROM "Items" WHERE "ItemCategory" = ($1)', [itemCategory], (error, results) => {
    // if there's an error (query typo, server connection issue, etc), throw (will crash the service)
    if (error) {
      throw error
    }
    // return the query results
    // HTTP code 200 = "success" for GET methods
    // results.rows gives the actual query data
    response.status(200).json(results.rows)
  })
  }
const specificListing = (request, response) => {
  // execute the SELECT query, query results are put into results
  const {itemName} = request.body;
  pool.query('SELECT * FROM "Items" WHERE "ItemName" = ($1)', [itemName], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  }  
const tagListing = (request, response) => {
  // execute the SELECT query, query results are put into results
  const {itemTag} = request.body;
  pool.query('SELECT * FROM "Items" WHERE "ItemTags" = ($1)', [itemTag], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  }  
const soldListing = (request, response) => {
  // execute the SELECT query, query results are put into results
  const {soldFlag} = request.body;
  pool.query('SELECT * FROM "Items" WHERE "ItemSoldFlag" = ($1)', [soldFlag], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  }
const updateItem = (request, response) => {
  const {itemName, itemDescription, itemCategory,imageData,itemTags} = request.body;
  pool.query('UPDATE "Image"  SET "ImageData" = ($1) WHERE "ItemName" = ($2)',[imageData, itemName], (error, results) => {
    if (error) {
      throw error
    }
    pool.query('UPDATE "Items" SET "ItemName" = ($1), "ItemDescription" = ($2), "ItemCategory" = ($3), "ItemImageID" = (SELECT "Image_ID" FROM "Image" WHERE "ItemName" = ($1)), "ItemTags" = ($4) WHERE "ItemName" = ($1)', [itemName, itemDescription, itemCategory,itemTags], (error,results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  })
  }
const updateSoldFlag = (request, response) => {
  const {itemName} = request.body;
  pool.query('UPDATE "Items" SET "ItemSoldFlag" = 1 WHERE "ItemName" = ($1)', [itemName], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  }
const createOrder = (request, response) => {
  const {itemName, sellerEmail, buyerEmail,salePrice} = request.body;
  pool.query('INSERT INTO "Orders" ("Item_ID", "Seller_ID","Buyer_ID","SalePrice") VALUES ((SELECT "Item_ID" FROM "Items" WHERE "ItemName" = ($1)),(SELECT "User_ID"  FROM "Users" WHERE "UserEmail" = ($2)),(SELECT "User_ID"  FROM "Users" WHERE "UserEmail" = ($3)),$4)', [itemName, sellerEmail, buyerEmail,salePrice], (error,results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  }
const searchOrder = (request, response) => {
  // execute the SELECT query, query results are put into results
  const {itemName,sellerEmail, buyerEmail} = request.body;
  pool.query('SELECT * FROM "Orders" WHERE "Item_ID" = (SELECT "Item_ID" FROM "Items" WHERE "ItemName" = ($1)) AND "Seller_ID" = (SELECT "User_ID"  FROM "Users" WHERE "UserEmail" = ($2)) AND "Buyer_ID" = (SELECT "User_ID"  FROM "Users" WHERE "UserEmail" = ($3))', [itemName,sellerEmail, buyerEmail], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  }
// export the methods so we can access them in index.js
// this is necessary to register them with a URL API endpoint
module.exports = {
    getUsers,
    createUser,
    updateUser,
    showMessages,
    createMessages,
    listItem,
    allItems,
    categoryListing,
    specificListing,
    tagListing,
    soldListing,
    updateItem,
    updateSoldFlag,
    createOrder,
    searchOrder,
  }

