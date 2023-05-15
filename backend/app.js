import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import config from "./modules/env.mjs";
import subRouter from "./public/src/sub.js";
import msgRouter from "./public/src/msg.js";
import logger from "./modules/logger.mjs";

const app = express();
const PORT = 8001;
const corsOptions = {
    origin: "http://localhost:8000",
    credentials : true
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req,res)=>{
    res.render("main");
})

// /key에 요청이 들어오면 publickey 반환
app.get('/key', (req,res)=>{
    res.send({
        key : process.env.public_key
    });
})

app.use('/sub', subRouter);
app.use('/msg', msgRouter);

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.listen(PORT,()=>{
    logger(`backend listening on port : ${PORT}`)
})