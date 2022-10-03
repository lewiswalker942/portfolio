const { request, response } = require('express');
const express = require('express');
const res = require('express/lib/response');
const Datastore = require('nedb');
const app = express();
app.listen(3000, () => console.log('listening at port 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb'}));

const bcrypt = require('bcrypt');
const mysql = require('mysql');
const CryptoJS = require('crypto-js');


db = bootDatabase('est_database')



var userRouter = express.Router();

app.post('/saveSession', (request,response) => {
    console.log(request.body);

    response.json({status: 'Session Saved!',
    processedData: '5'});
});

app.post('/register', (request,response) => {
    console.log('register request recieved')
    const userID = request.body.userID;
    const pwd = request.body.pwd;

    // verify no spaces
    if (!userID.includes(' ') && !pwd.includes(' ')){
        var user_salt = '';
        var hashed_pwd = '';        

        var q = db.query("SELECT * FROM accounts_dev WHERE userID = '"+userID+"'", function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                // user exists
                console.log('user exists');
                create_account_result = {action: 'User already exists'};
                response.json(create_account_result);
            } else {
                // user does not exist
                console.log('user does not exist');
                const new_key = null;
                
                const saltRounds = 10;
                bcrypt.genSalt(saltRounds, function(err, generated_salt) {
                    user_salt = generated_salt;
                    bcrypt.hash(pwd, generated_salt, function(err, hashed_pwd) {
                        // Store hash in your password DB.
                        const sql_query = "INSERT INTO accounts_dev (userID, pwd_hash, auth_key) VALUES (?, ?, ?)"
                        console.log('hashed pwd = ' + hashed_pwd)

                        db.query(sql_query, [userID, hashed_pwd, new_key], function (err, result) {
                            if (err) throw err;
                            create_account_result = {action: 'Account created', auth_key: new_key};
                            response.json(create_account_result);
                        });
                    });
                });
            }
        });
    }

    


});

app.post('/login', (request,response) => {
    console.log('login request recieved')
    const userID = request.body.userID;
    const pwd = request.body.pwd;

    // verify no spaces
    if (!userID.includes(' ') && !pwd.includes(' ')){
        var q = db.query("SELECT * FROM accounts_dev WHERE userID = ?", [userID], function (err, result, fields) {
            if (err) throw err;
            if (result.length == 0) {
                console.log('user does not exist');
                create_account_result = {action: 'Invalid credentials'};
                response.json(create_account_result);
            } else if (result.length == 1){
                console.log('user exists');
                bcrypt.compare(pwd, result[0].pwd_hash, function(err, result) {
                    if (result) {
                        const new_key = CryptoJS.SHA256(String(Math.floor(Math.random()*(4294967296235444654)))).toString();
                        //save new key and validity expiration to DB
                        db.query("UPDATE accounts_dev SET auth_key = ? WHERE userID = ?",[new_key, userID]);
                        console.log('New Key:' + new_key)
                        create_account_result = {action: 'Logged in!', email: userID, auth_key: new_key};
                        response.json(create_account_result);
                    } else {
                        create_account_result = {action: 'Invalid credentials'};
                        response.json(create_account_result);
                    }
                })
            }
        });
    }
});


app.post('/verifysession', (request,response) => {
    console.log('Verification request recieved')
    const userID = request.body.userID;
    const auth_key = request.body.auth_key;

    // injection shielding logic here
    if ((!is_email(userID))||(!auth_key.length==64)||(auth_key.includes(' '))) {
        console.log('Auth Error')
        response.json({is_verified: 'false'})        
        return 0;
    }
    var q = db.query("SELECT * FROM accounts_dev WHERE userID = ?", [userID], function (err, result, fields) {
        if (err) throw err;
        console.log('Existing key' + result[0].auth_key)
        if(result[0].auth_key == auth_key) {
            response_json = {is_verified: 'true'};
            response.json(response_json);
        } else {
            response_json = {is_verified: 'false'};
            response.json(response_json);
        }
    });

});



app.get('/api', (request,response) => {
    console.log("API request recieved");
    const u =  request.url;
    console.log(u)
    
    const url = u.split("?");

    let searchParams = new URLSearchParams(url[1]);

    console.log(searchParams);

    switch (searchParams.get("type")) {
        case "f22":
            console.log("success!");
            response.json({msg: 'Hello there'});
        default:
            response.json({msg: 'Rejected'});
    }

    
});





/////////////////////////////////////////////////////////////////////////////////////////////////
function bootDatabase(name) {
    const db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "jsIuek8f73&984s3fas",
        database: name
      });
      
      db.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });

      return db;
}



function is_email(address) {
    if (!address.includes("@")) {
        console.log('Error 1')
        return false
    }else if (!address.includes(".")) {
        console.log('Error 2')
        return false
    } else if (!address.includes(".com",".co.uk",".ac.uk",".au",".edu",".de")) {
        console.log('Error 3')
        return false
    } else if (address.includes(" ")) {
        console.log('Error 4')
        return false
    }
    var parts = address.split("@");
    console.log(parts.length)
    if (parts.length!=2) {
        console.log('Error 5')
        return false
    } else {
        return true
    }
}