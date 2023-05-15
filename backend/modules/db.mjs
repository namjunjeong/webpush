/*
db control을 위한 변수 con을 export하는 모듈
서버에 붙은 mariadb와 통신하며 통신과정에서는 docker의 내부 DNS기능 이용
*/
import mysql from "mysql";
import config from "./env.mjs";
import logger from "./logger.mjs";

var con = mysql.createConnection({
    host : config.dbhost,
    user : config.dbuser,
    password : config.dbpass,
    database : config.dbname,
    port : config.dbport
})

con.connect((err)=>{//initialize과정. table이 없을경우 생성
    if (err) throw err;
    logger("Database connected");
    logger("create table initialize");
    /*
    webpush를 위해서는 endpoint, auth, p256dh값이 필요
    endpoint는 브라우저에따라 종류가 달라지기에 500의 길이를 할당
    */
    con.query(`CREATE TABLE subscriber(
        id VARCHAR(20) PRIMARY KEY,
        endpoint VARCHAR(500) NOT NULL,
        auth VARCHAR(50) NOT NULL,
        p256dh VARCHAR(200) NOT NULL,
        last_update DATETIME DEFAULT NOW()
        )`,(err, result)=>{
        if(err){
            if (err.code == "ER_TABLE_EXISTS_ERROR"){
                logger("Table already exist");
            }
        }
        if (result) logger("Table created");
        logger("create table finished");
    })
})

export default con;