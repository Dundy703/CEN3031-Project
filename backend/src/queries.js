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


//Gets a specific item from the offers table
const getOffersFromItem = (request, response) => {
  const itemName = request.query.itemName;
  pool.query('SELECT * FROM "Items" WHERE "Item_ID" = ($1)', [itemName], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
//Gets all the offers that come from a certain accountt
const getOffersFromUserEmail = (request, response) => {
  const userEmail = request.query.userEmail;
  pool.query('SELECT * FROM "Users" WHERE "UserEmail" = ($1)', [userEmail], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
//Gets the profile picture from a specific account
const getImageFromUserEmail = (request, response) => {
  const userEmail = request.query.userEmail;
  pool.query('SELECT "ImageData" FROM "Image" WHERE "Image_ID" = (SELECT "UserProfilePictureID" FROM "Users" WHERE "UserEmail" = ($1))', [userEmail], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
//Gets the image of a specific item 
const getImageFromItem = (request, response) => {
  const itemName = request.query.itemName;
  pool.query('SELECT "ImageData" FROM "Image" WHERE "Image_ID" = (SELECT "ItemImageID" FROM "Items" WHERE "itemName" = ($1))', [itemName], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
//Show all the messages between two users 
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
//Stores the messages between two users 
const createMessages = (request, response) => {
  const {senderEmail, receiverEmail, messageContent} = request.body;
  pool.query('INSERT INTO "Messages" ("Receiver_ID", "Sender_ID", "MessageContent") VALUES ((SELECT "User_ID" FROM "Users" WHERE "UserEmail" = ($2)),(SELECT "User_ID" FROM "Users" WHERE "UserEmail" = ($1)),$3)', [senderEmail, receiverEmail, messageContent], (error,results) => {
    if (error) {
      throw error
    }
      response.status(200).json(results.rows)
    })
  }
//Create a listing of an item and stores the item's image and information
const listItem = (request, response) => {
  const {itemName, itemDescription, itemPrice, imageData, sellerEmail} = request.body;
  pool.query('INSERT INTO "Image" ("ImageData", "ItemName") VALUES ($1,$2)',[imageData, itemName], (error, results) => {
    if (error) {
      throw error
    }
    pool.query('INSERT INTO "Items" ("ItemName", "ItemDescription","ItemPrice","ItemImageID","Seller_ID") VALUES ($1,$2,$3,(SELECT "Image_ID" FROM "Image" WHERE "ItemName" = ($1) ORDER BY "Image_ID" DESC LIMIT 1),(SELECT "User_ID" FROM "Users" WHERE "UserEmail" = ($4)))', [itemName, itemDescription, itemPrice, sellerEmail], (error,results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  })
  }
//Shows all items that have been listed 
const allItems = (request, response) => {
  pool.query('SELECT * FROM "Items"', (error, results) => {
    if (error) {
      throw error
    }
      response.status(200).json(results.rows)
    })
}

const userItems = (request, response) => {
  const userEmail = request.query.userEmail;
  pool.query('SELECT * FROM "Items" WHERE "Seller_ID" = (SELECT "User_ID" FROM "Users" WHERE "UserEmail" = ($1))', [userEmail], (error, results) => {
    if (error) {
      throw error
    }
      response.status(200).json(results.rows)
    })
}

//Shows all the items based on a specific search
const likeItems = (request, response) => {
  const itemName = request.query.itemName;
  pool.query('SELECT * FROM "Items" WHERE "ItemName" LIKE $1', [`%${itemName}%`], (error,results) => {
    if (error) {
      throw error
    }
      response.status(200).json(results.rows)
    })
}
//Shows all items based on what categories the user would like to see
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
//Displays a specific item 
const specificListing = (request, response) => {
  const itemName = request.query.itemName;
  pool.query('SELECT * FROM "Items" WHERE "ItemName" = ($1)', [itemName], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  }  
//Shows all items based on what item tags the user would like to see
const tagListing = (request, response) => {
  const itemTag = request.query.itemTag;
  pool.query('SELECT * FROM "Items" WHERE "ItemTags" = ($1)', [itemTag], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  }  
//Shows all the items that have been sold
const soldListing = (request, response) => {
  const soldFlag = request.query.soldFlag;
  pool.query('SELECT * FROM "Items" WHERE "ItemSoldFlag" = ($1)', [soldFlag], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  }
//Updates the information of an item
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
//Updates whether an item has been sold or not
const updateSoldFlag = (request, response) => {
  const {itemName} = request.body;
  pool.query('UPDATE "Items" SET "ItemSoldFlag" = 1 WHERE "ItemName" = ($1)', [itemName], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  }
//Inserts any offer created by a buyer 
const createOffer = (request, response) => {
  const {itemName, sellerEmail, buyerEmail, offerPrice, dateSent} = request.body;
  pool.query('INSERT INTO "Offers" ("Item_ID", "Seller_ID", "Buyer_ID", "OfferPrice", "OfferSentDate", ApprovedFlag) VALUES ((SELECT "Item_ID" FROM "Items" WHERE "ItemName" = ($1)) , (SELECT "User_ID"  FROM "Users" WHERE "UserEmail" = ($2)), (SELECT "User_ID"  FROM "Users" WHERE "UserEmail" = ($3)), $4, $5, (FALSE))', [itemName, sellerEmail, buyerEmail, offerPrice, dateSent], (error, results) => {
    if (error) {
      throw error
    }
      response.status(200).json(results.rows)
    })
}
//Updates an offer made by a buyer
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
//Deletes all offers on an item once it has been sold 
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
//Once a item has been sold, create an order with its order details 
const createOrder = (request, response) => {
  const {itemName, sellerEmail, buyerEmail,salePrice} = request.body;
  pool.query('INSERT INTO "Orders" ("Item_ID", "Seller_ID","Buyer_ID","SalePrice") VALUES ((SELECT "Item_ID" FROM "Items" WHERE "ItemName" = ($1)),(SELECT "User_ID"  FROM "Users" WHERE "UserEmail" = ($2)),(SELECT "User_ID"  FROM "Users" WHERE "UserEmail" = ($3)),$4)', [itemName, sellerEmail, buyerEmail,salePrice], (error,results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  }
//Search for a specific order 
const searchOrder = (request, response) => {
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
    getImageFromUserEmail,
    likeItems,
    userItems
  }

