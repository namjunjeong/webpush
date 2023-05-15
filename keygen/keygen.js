/*
vapidkey generate를 위한 프로그램
database를 점검하여 키가 존재하면 pass
존재하지 않을 경우 webpush 라이브러리를 사용하여 vapidkey 생성
database에 저장한 후 컨테이너 exit
*/

const webpush = require("web-push")
const mysql = require("mysql")

var con = mysql.createConnection({
    host : process.env.MYSQL_HOST, //도커 컨테이너 이름을 통해 통신
    user : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
    database : process.env.MYSQL_DATABASE
},)


con.connect((err)=>{
    if (err) throw err;
    console.log("done");
    con.query(`SELECT * FROM vapidkey`,(err,result)=>{
        if (err){
            if (err.code == "ER_NO_DB_ERROR"){
                console.log("no data");
                console.log("initialize create key");
            }else{
                throw err;
            }
        }
        if(result.length==0){//vapidkey 생성
            const keys = webpush.generateVAPIDKeys();
            var public = keys.publicKey
            var private = keys.privateKey
            //database에 insert
            con.query(`INSERT INTO vapidkey(public_key,private_key) VALUES(?,?)`,[public,private],(err,result)=>{
                if(err) throw err;
                console.log("key inserted");
                con.end();
            })
        }else{//key가 database에 이미 존재
            console.log("key already exist")
            con.end();
        }
    })
})