const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const PORT = 8081;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors(
   { 
        origin: ["http://localhost:3000"],
        methods: ["POST ,GET"],
        credentials: true
    }
));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"signup"
});

const verifyUser = (req, res ,next) => {
    //this is the token i created in post , the name was 'token': res.cookie('token',token); so is can be available or not
    const token = req.cookies.token;
    //if not available
    if(!token){
        return res.json({Message: "we need token please provide it."});
    }else{
        // if it was available then we willl verify our token, and secret key
        jwt.verify(token, "our-jsonwebtoken-secret-key", (err, decoded) => {
            // decoded will get name , data[0].name;
            if(err){
                return res.json({Message: "Authentication Error."});
            }else {
                // decode our name req 
                req.name = decoded.name;
                // call next() middleware
                next();
            }
        })
    }

}
app.get('/', verifyUser ,(req, res) => {
    // need to send back requset user name
    return res.json({Status : "Success", name: req.name});
});

app.post('/login' , (req , res) => {
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    
    db.query(sql, [req.body.email, req.body.password] , (err, data) => {
        if(err) return res.json({Message: "Server Side Error"});
        if(data.length > 0) {       
            const name = data[0].name;
            const token = jwt.sign({name} , "our-jsonwebtoken-secret-key" , {expiresIn: '1d'});
            res.cookie('token',token);
            return res.json({Status: "Success"});
        }else{
            return res.json({Message: "No Recorde existed"});
        }

    })
});
app.get('/logout' , (req , res) => {
    // clear our cookies now, and we assign the name - it was 'token'. not: we create hime in app.post('/login')
    res.clearCookie('token');
    //return success message to the home component
    res.json({Status: 'Success'});
});

app.listen(PORT, () => {
    console.log("Running on port: " + PORT);
})