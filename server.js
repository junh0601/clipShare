
const express = require("express");
const morgan = require("morgan");
const crypto = require("crypto");
const setting = require("./setting.json");
const fs = require('fs');
const path = require('path');
const { get } = require("http");

let securedId = setting.password;
let store = "";

const PORT = 8080;

const app = express();
const logger = morgan("dev");
const rootRouter = express.Router();

const getHome = (req, res)=> {
    return res.render("home",{securedId, store});
};

const postHome = (req, res) => {
    const {clipboard, setpw} = req.body;
    const setting ={"password":setpw};
    fs.writeFileSync(path.resolve(__dirname, 'setting.json'), JSON.stringify(setting));
    securedId=setpw;
    store= clipboard;
    console.log("data posted")
    return res.redirect("/");
};

const getClip = async (req, res) => {
    const {id} = req.params;
    const hashFromServer = crypto.createHash('sha256').update(securedId).digest('hex');
    if(hashFromServer===id){
        console.log(`data sending : ${store}`);
        return res.send(`${store}`);
    }else{
        return res.status(404).end();
    }
};

const getCatch = (req, res) => {
    return res.render("catch");
};

const postCatch = (req, res) => {
    return res.end();
};

rootRouter.route("/").get(getHome).post(postHome);
rootRouter.route("/catch").get(getCatch).post(postCatch);
rootRouter.get("/:id", getClip);

app.set("view engine", "pug");
app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use("/", rootRouter);




app.listen(PORT, ()=> console.log(`server is running : http://localhost:${PORT}`));