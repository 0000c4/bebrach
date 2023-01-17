const express = require('express')
const expressHbs = require('express-handlebars')
const hbs = require('hbs')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser')
const controller = require('./node/controller')
const threadController = require("./node/threadController")
const authCheck = require('./node/authCheck')
const app = express();

app.use(fileUpload({}));
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(express.json());
app.use(express.static(__dirname + "/"));
app.engine("hbs", expressHbs.engine(
    {
        layoutsDir: "views/layouts",
        defaultLayout: "layout",
        extname: "hbs"
    }
));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");


app.get("/",function(req,res){
    let auth = authCheck(req.cookies.token)
    res.render("index.hbs",{indexStyles: true, auth: auth, name: auth.userName})
})
app.post("/", controller.login);

app.get("/about", function(req,res){
    let auth = authCheck(req.cookies.token)
    res.render("about.hbs",{indexStyles: true, auth: auth, name: auth.userName})
})
app.get("/registration",function(req,res){
    res.render("registration.hbs",{registrationStyles: true})
})
app.post("/registration", controller.registration)

app.get("/newThread",function(req,res){
    let auth = authCheck(req.cookies.token)
    res.render("newThread.hbs",{newThreadStyles:true, auth: auth, name: auth.userName})
})
app.post("/newThread",threadController.newThread)

app.get("/thread",threadController.threadRender)

app.use("/thread",threadController.newMsg)

app.get("/all",threadController.threadsListRender)

async function main(){
    try{
    app.listen(1488, ()=>{console.log("сервер запушен")})
    await mongoose.connect("mongodb://127.0.0.1:27017/bebrach_database");
    }
    catch(error){
        console.log(error);
    }
}
main();