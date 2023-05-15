import express from "express";
import path from "path";
import ejs from "ejs";
import logger from "./modules/logger.mjs";
const __dirname = path.resolve();

const app = express();
const PORT = 8000;

//static file 제공
app.use(express.static(__dirname + '/public/templates'));
app.set('views', __dirname + '/public/templates');
app.engine('html', ejs.renderFile);
app.use("/", express.static('./'))

app.listen(PORT,()=>{
    logger(`frontend server listening on port : ${PORT}`);
})