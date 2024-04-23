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



const getOffersFromItem = (request, response) => {
  const itemName = request.query.itemName;
  pool.query('SELECT * FROM "Items" WHERE "Item_ID" = ($1)', [itemName], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getOffersFromUserEmail = (request, response) => {
  const userEmail = request.query.userEmail;
  pool.query('SELECT * FROM "Users" WHERE "UserEmail" = ($1)', [userEmail], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getImageFromUserEmail = (request, response) => {
  const userEmail = request.query.userEmail;
  pool.query('SELECT "ImageData" FROM "Image" WHERE "Image_ID" = (SELECT "UserProfilePictureID" FROM "Users" WHERE "UserEmail" = ($1))', [userEmail], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getImageFromItem = (request, response) => {
  const itemName = request.query.itemName;
  pool.query('SELECT "ImageData" FROM "Image" WHERE "Image_ID" = (SELECT "ItemImageID" FROM "Items" WHERE "itemName" = ($1))', [itemName], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const showMessages = (request, response) => {
    const senderEmail = request.query.senderEmail;
    const receiverEmail = request.query.receiverEmail;
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
  const {itemName, itemDescription, itemPrice, imageData,} = request.body;
  pool.query('INSERT INTO "Image" ("ImageData", "ItemName") VALUES ($1,$2)',[imageData, itemName], (error, results) => {
    if (error) {
      throw error
    }
    pool.query('INSERT INTO "Items" ("ItemName", "ItemDescription","ItemPrice","ItemImageID") VALUES ($1,$2,$3,(SELECT "Image_ID" FROM "Image" WHERE "ItemName" = ($1)))', [itemName, itemDescription, itemPrice], (error,results) => {
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
  const itemCategory = request.query.itemCategory;
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
  const itemName = request.query.itemName;
  pool.query('SELECT * FROM "Items" WHERE "ItemName" = ($1)', [itemName], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  }  
const tagListing = (request, response) => {
  // execute the SELECT query, query results are put into results
  const itemTag = request.query.itemTag;
  pool.query('SELECT * FROM "Items" WHERE "ItemTags" = ($1)', [itemTag], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  }  
const soldListing = (request, response) => {
  // execute the SELECT query, query results are put into results
  const soldFlag = request.query.soldFlag;
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
const createOffer = (request, response) => {
  const {itemName, sellerEmail, buyerEmail, offerPrice, dateSent} = request.body;
  pool.query('INSERT INTO "Offers" ("Item_ID", "Seller_ID", "Buyer_ID", "OfferPrice", "OfferSentDate", ApprovedFlag) VALUES ((SELECT "Item_ID" FROM "Items" WHERE "ItemName" = ($1)) , (SELECT "User_ID"  FROM "Users" WHERE "UserEmail" = ($2)), (SELECT "User_ID"  FROM "Users" WHERE "UserEmail" = ($3)), $4, $5, (FALSE))', [itemName, sellerEmail, buyerEmail, offerPrice, dateSent], (error, results) => {
    if (error) {
      throw error
    }
      response.status(200).json(results.rows)
    })
}
const updateOffer = (request, response) => {
  const {sellerEmail, buyerEmail} = request.body;
  pool.query('UPDATE "Offers" SET "ApprovedFlag" = TRUE WHERE "Seller_ID" = (SELECT "User_ID" FROM "Users" WHERE "UserEmail" = $1) AND "Buyer_ID" = (SELECT "User_ID" FROM "Users" WHERE "UserEmail" = $2)', [sellerEmail, buyerEmail], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows)
    }
  )
}
const cleanOffers = (request, response) => {
  const {itemName} = request.body;
  pool.query('DELETE FROM "Offers" WHERE "ApprovedFlag" = FALSE AND WHERE "Item_ID" = (SELECT "Item_ID" FROM "Items" WHERE "ItemName" = $1)', [itemName], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows)
    }
  )
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
  const itemName = request.query.itemName;
  const sellerEmail = request.query.sellerEmail;
  const buyerEmail = request.query.buyerEmail;
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
    createOffer,
    getOffersFromItem,
    getOffersFromUserEmail,
    updateOffer,
    cleanOffers,
    getImageFromItem,
    getImageFromUserEmail
  }

