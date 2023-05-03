const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const connection = mysql.createConnection({
	host: "server2.bsthun.com",
	port: "6105",
	user: "lab_1hlwyx",
	password: "yAiHzNqx2t11hCx4",
	database: "lab_todo02_1h5nfkm",
});

connection.connect((error) => {
	if (error) {
		console.error("Error connecting to database:", error);
		return;
	}
	console.log("Database is connected");
});

const port = 3000;
const app = express();

app.use(bodyParser.json({ type: "application/json" }));

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

app.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    var sql = mysql.format(
        		"SELECT * FROM users WHERE username = ?",
        		[username]
        	);

    connection.query(sql, [username, password], (err,rows) =>{
        if(err){
            return res.json({
                success: false
            });
        }
        numRows = rows.length;
        console.log(rows)
        if(numRows != 0){
            bcrypt.compare(password, rows[0].hashed_password).then(function(result) {
                if(result){
                    return res.json({
                        success: true,
                        message: "Authentication Success"
                    });
                }else{
                    return res.json({
                        success: false,
                        message: "Authentication Failed - Wrong password"
                    });
                }
                
            });
        }else{
            return res.json({
                success: false,
                message: "Authentication Failed - No such user in the database"
            });
        }
        
    })
})

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/i;
    if (!pattern.test(password)) {
        return res.json({
            success: false,
            message:
            "Password must contain at least 8 characters, at least one uppercase, lowercase, and number in the string.",
            });
        } else {
      
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        created_at = date+' '+time;
        updated_at = created_at;
        saltRounds = 10;
        hash = bcrypt.hashSync(password, saltRounds);
        var sql = `INSERT INTO users (username, password, hashed_password, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)`;
        connection.query(sql, [username, password, hash, created_at, updated_at], (err, rows) => {
            if (err) {
            return res.json({
                success: false,
                error: err,
                message: "An error occurred while registering the user.",
            });
            }
            return res.json({
            success: true,
            message: "User registered successfully.",
            });
      });
    }
  });