/*
새로운 구독자 등록을 위한 코드
/sub로 post 요청이 들어올 경우 endpoint에 따라 이미 유저가 존재하는지 확인
존재한다면 등록된 id를 return, 그렇지 않다면 새로 등록 후 id return
rescode라는 프로토콜을 사용하여 프론트엔드와 통신
*/

import express from "express";
import logger from "../../modules/logger.mjs";
import con from "../../modules/db.mjs";

const subRouter = express.Router();

subRouter.post("/",(req, res)=>{
    let sub_info = req.body;
    let id = sub_info.id;
    let endpoint = sub_info.endpoint
    let auth = sub_info.keys.auth
    let p256dh = sub_info.keys.p256dh
    con.query(`SELECT * from subscriber WHERE id=?`,[id],(err,result,fields)=>{
        if (err){
            logger(err)
            if (err.code == "ER_NO_DB_ERROR"){
                logger("no data");
            }else{
                throw err;
            }
        }
        if(result.length==0){
            con.query(`SELECT * from subscriber WHERE endpoint=?`,[endpoint],(err,result,fields)=>{
                if (err){
                    logger(err)
                    if (err.code == "ER_NO_DB_ERROR"){
                        logger("no data");
                    }else{
                        throw err;
                    }
                }
                if(result.length!=0){//데이터 존재
                    logger("user already exist");
                    res.send({
                        rescode : "already",
                        id : result[0].id
                    })
                }else{//데이터 미존재
                    logger("insert user data");
                    con.query(`INSERT INTO subscriber(id,endpoint,auth,p256dh) VALUES(?,?,?,?)`,[id,endpoint,auth,p256dh],(err,result)=>{
                        if(err) throw err;
                        logger("subscriber data inserted");
                        res.send({
                            rescode : "inserted",
                            id : id
                        })
                    })
                }
            })
        }else{
            res.send({
                rescode : "inuse",
                id : id
            })
        }
    })
    
})

export default subRouter;