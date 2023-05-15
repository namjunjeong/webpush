/*
고유한 id를 가진 유저에게 push 전달
혹은 서버에 등록된 모든 유저에게 broadcast push 전달
keygen 컨테이너를 통해 생성된 vapidkey를 가져온 후 webpush에 등록
form에서 들어오는 post요청을 key값의 갯수로 판단하여 broadcast 혹은 단일통신
*/

import express from "express";
import logger from "../../modules/logger.mjs";
import con from "../../modules/db.mjs";
import webpush from "web-push";

const msgRouter = express.Router();

con.query('SELECT * FROM vapidkey',(err,result)=>{
    if(err) throw err;
    process.env['public_key'] = result[0].public_key
    webpush.setVapidDetails(
        "playjnj:playjnj@khu.ac.kr",
        result[0].public_key,
        result[0].private_key
    );
})

msgRouter.post("/", (req,res)=>{
    let msg_title = req.body.msgtitle;
    let msg_body = req.body.msgbody;
    if(!msg_title) msg_title = "no data";
    if(!msg_body) msg_body = "no data";
    if(Object.keys(req.body).length == 3){//단일대상 전송
        let id = req.body.id;
        if(!id) res.send("<h1> please input id </h1>")
        else{
            con.query("SELECT * FROM subscriber WHERE id=?",[id],(err,result,fields)=>{
                if (err){
                    console.log(err)
                    logger(err)
                    if (err.code == "ER_NO_DB_ERROR"){
                        logger("no data");
                    }else{
                        throw err;
                    }
                }
                if(result.length!=0){
                    webpush.sendNotification({//webpush 전송
                        endpoint: result[0].endpoint,
                        keys: {
                        p256dh: result[0].p256dh,
                        auth: result[0].auth
                        }
                    }, JSON.stringify({title : msg_title, body : msg_body}))
                    res.send("<h1> msg send </h1>")
                }else{
                    res.send("<h1> no such user in database </h1>")
                }
            })
        }
    }else if(Object.keys(req.body).length == 2){//broadcast 전송
        con.query("SELECT * FROM subscriber",(err,result,fields)=>{
            if (err){
                logger(err)
                if (err.code == "ER_NO_DB_ERROR"){
                    logger("no data");
                }else{
                    throw err;
                }
            }
            if(result.length!=0){//db에 데이터 존재
                for(const res of result){//iter 순회하며 메시지 전송
                    webpush.sendNotification({
                        endpoint: res.endpoint,
                        keys: {
                        p256dh: res.p256dh,
                        auth: res.auth
                        }
                    }, JSON.stringify({title : msg_title, body : msg_body}))
                }
                res.send("<h1> msg send </h1>")
            }else{//db 데이터 미존재
                res.send("<h1> no user in database </h1>")
            }
        })
    }else{
        logger("error occured");
        logger(req.body);
        res.send("<h1> error occured </h1>")
    }
})



export default msgRouter;