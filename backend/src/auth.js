const Pool = require('pg').Pool
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'in-the-age-of-chaos-two-factions-battle-for-dominance';

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

const createUser = (request, response) => {
    // get data to insert from the request body
    const { imageData, userEmail,  userUsername,userPassword,userFirstName,userLastName,userAddressLine1,userAddressLine2,userState,userCity,userZipCode} = request.body;
    // spooooky encryption :O
    bcrypt.hash(userPassword, 7, (hashError, hashedPassword) => {
        if (hashError) {
          throw hashError;
        }
    
        // execute the INSERT query, get the results back so we can confirm
        pool.query('INSERT INTO "Image" ("ImageData", "UserEmail") VALUES ($1,$2)',[imageData, userEmail], (error, results) => {
        if (error) {
            throw error
        }
        pool.query('INSERT INTO "Users" ("UserEmail","UserUsername","UserPassword","UserFirstName","UserLastName","UserAddressLine1","UserAddressLine2","UserState","UserCity","UserZipCode","UserProfilePictureID") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,(SELECT "Image_ID" FROM "Image" WHERE "UserEmail" = ($1) ORDER BY "Image_ID" DESC LIMIT 1))', [userEmail,  userUsername,hashedPassword,userFirstName,userLastName,userAddressLine1,userAddressLine2,userState,userCity,userZipCode], (error,results) => {
            if (error) {
            throw error
            }
            response.status(201).send(`User added`)
        });
    });
  });
};

const updateUser = (request, response) => {
    const { imageData, userEmail,  userUsername,userPassword,userFirstName,userLastName,userAddressLine1,userAddressLine2,userState,userCity,userZipCode} = request.body;

    bcrypt.hash(userPassword, 7, (hashError, hashedPassword) => {
        if (hashError) {
          throw hashError;
        }

        pool.query('UPDATE "Image"  SET "ImageData" = ($1) WHERE "UserEmail" = ($2)',[imageData, userEmail], (error, results) => {
        if (error) {
            throw error
        }
        pool.query('UPDATE "Users" SET "UserEmail" = ($1), "UserUsername" = ($2),"UserPassword" = ($3),"UserFirstName" = ($4),"UserLastName" = ($5),"UserAddressLine1" = ($6),"UserAddressLine2" = ($7),"UserState" = ($8),"UserCity" = ($9),"UserZipCode" = ($10),"UserProfilePictureID" = (SELECT "Image_ID" FROM "Image" WHERE "UserEmail" = ($1) ORDER BY "Image_ID" DESC LIMIT 1) WHERE "UserEmail" = ($1)', [userEmail,  userUsername,hashedPassword,userFirstName,userLastName,userAddressLine1,userAddressLine2,userState,userCity,userZipCode], (error,results) => {
            if (error) {
            throw error
            }
            response.status(201).send(`User updated`)
        });
    });
  });
};


const verifyUser = (request, response) => {
    const { userEmail, userPassword } = request.body;
  
    pool.query('SELECT "UserPassword" FROM "Users" WHERE "UserEmail" = ($1)', [userEmail], (error, results) => {
      if (error) {
        throw error;
      }
  
      if (results.rows.length === 0) {
        response.status(401).send('Incorrect Username or Password');
        return;
      }
  
      const hashedPassword = results.rows[0].UserPassword;
  
      bcrypt.compare(userPassword, hashedPassword, (compareError, result) => {
        if (compareError) {
          throw compareError;
        }
  
        if (result) {
            const token = jwt.sign({ userEmail }, secretKey, { expiresIn: '4h' });
            response.status(200).json({ token, message: 'Successful Login' });
        } else {
          response.status(401).send('Incorrect Username or Password');
        }
      });
    });
  };



// method to get all users in the DB table
const getUsers = (request, response) => {
    // execute the SELECT query, query results are put into results
    const userEmail = request.query.userEmail;
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

  const getUserByID = (request, response) => {
    // execute the SELECT query, query results are put into results
    const userID = request.query.userID;
    pool.query('SELECT * FROM "Users" WHERE "User_ID" = ($1)', [userID], (error, results) => {
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

  const getUserByUsername = (request, response) => {
    // execute the SELECT query, query results are put into results
    const userUsername = request.query.userUsername;
    pool.query('SELECT * FROM "Users" WHERE "UserUsername" = ($1)', [userUsername], (error, results) => {
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

  const checkToken = (request, response) => {
    const token = request.headers.authorization.split(' ')[1];
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return response.status(401).json({ message: 'Unauthorized'});
      }
      response.json({ message: 'Success', email: decoded});
    });
  };

  module.exports = {
    getUsers,
    createUser,
    updateUser,
    verifyUser,
    checkToken,
    getUserByID,
    getUserByUsername
  }