const fs = require("fs")
const hbs = require('hbs')
const authCheck = require('./authCheck')
const pattern = {
    "name": "",
    "description": "",
    "author": "",
    "date": ""
}
const patternThread = [{
    "msg": "",
    "author": "",
    "date": "",
    //"reply": null,
    "id": 0
}]

function rowsCounter(threads){//распределяет треды между столбцами поровну
    let rows = [0,0,0]
    if(threads.length % 3 == 0){ //если количество тредов делится на 3 нацело, распределить между столбцами поровну
        rows[0] = threads.length / 3;
        rows[1] = rows[0]  //чтобы не считать одну и ту же операцию, присвоить из уже вычисленной переменной
        rows[2] = rows[0]
    }
    else{ //если количество тредов не делится на 3 нацело
        rows[0] = (threads.length - (threads.length % 3)) / 3;//распределить между столбцами поровну как на уровне выше
        rows[1] = rows[0]
        rows[2] = rows[0]
        if((threads.length % 3) % 2 == 0){ //если остаток делится на 2, распределить его между первыми 2 остатками
            rows[0] += (threads.length % 3)/2;   
            rows[1] = rows[0]  //чтобы не считать одну и ту же операцию, присвоить из уже вычисленной переменной
        }
        else{
            rows[0] += 1//т.к остаток может быть только 1, добавить его в первый столбец и продолжить распределение между столбцами без него
            rows[0] += ((threads.length-1) % 3)/2;   
            rows[1] += ((threads.length-1) % 3)/2;   
        }
    }
    return rows;
}
class threadController {
    newThread(req, res) {
        fs.mkdirSync("threads/" + req.body.head);//создание папки треда
        let config = pattern;//чтение шаблона
        config.name = req.body.head;
        config.description = req.body.body;
        config.author = authCheck(req.cookies.token).userName;
        config.date = new Date();//настройка конфига
        let thread = patternThread;
        thread[0].msg = config.name + "\n-" + config.description;
        thread[0].author = config.author;
        thread[0].date = config.date;//создание первого сообщения в треде по умолчанию из конфига
        thread[0].id = 0
        fs.writeFileSync("threads/" + req.body.head + "/" + req.body.head + "_config" + ".json", JSON.stringify(config))//запись конфига
        fs.writeFileSync("threads/" + req.body.head + "/" + req.body.head + ".json", JSON.stringify(thread))//запись основного дерева треда
        res.redirect("/thread?id=" + req.body.head)//переадресация на только что созданный тред
    }
    newMsg(req, res) {
        console.log(req.body)
        let id = decodeURI(req.body.name) //имя треда
        let thread = JSON.parse(fs.readFileSync("threads/" + id + "/" + id + ".json"))
        const date = new Date();
        let message = {
            "msg": req.body.msg,
            "author": authCheck(req.cookies.token).userName,
            "date": date.toLocaleDateString() + " " + date.toLocaleTimeString(),
            "id": thread[thread.length-1].id + 1//получение последнего айди сообщения в треде
        }
        if(req.body.reply != "null"){message.reply = req.body.reply;}
        thread.push(message)
        fs.writeFileSync("threads/" + id + "/" + id + ".json", JSON.stringify(thread))
        if(req.files != null){req.files.image.mv("threads/" + id + "/" + "img_id:" + message.id +".jpg")};
        res.redirect("/thread?id=" + id)
    }
    threadRender(req, res) {//рендер треда
        let auth = authCheck(req.cookies.token)//проверка авторизации пользователя для формы в навигации
        let id = req.query.id //получение имени треда из запроса
        let thread = fs.readFileSync("threads/" + id + "/" + id + ".json") //поиск треда по имени в хранилище
        thread = JSON.parse(thread) //запись треда который представляет массив в переменную
        let reply = "";
        let img = "";
        let data = ""; //переменная строки для вставки в html
        for (let i = 0; i < thread.length; i++) {//рендер каждого сообщения
            if(fs.existsSync("threads/" + id + "/" + "img_id:" + thread[i].id +".jpg"))
            {img= '<img class="image" src="'+ 'threads/' + id + '/img_id:' + thread[i].id + '.jpg"></img>'}
            if(thread[i].reply != null){
                reply = '<a name="' + thread[i].reply + '" onclick="focusMsg(this.name)"  class="link"> >>'+ thread[i].reply +'</a>';}
            data += '<article><div class="header">' + thread[i].author +' '+ thread[i].date + reply +
            '<a id="' + thread[i].id + '" onclick="reply(this.id)" tabindex="0">ответить</a></div>' + img + '<p>' + thread[i].msg + '</p></article>';
            img = ""
            reply = "";
        }
        res.render("thread.hbs", {
            body: new hbs.SafeString(data),
            threadStyles: true,
            auth: auth,
            name: auth.userName
        })
    }
    
    threadsListRender(req,res){
        let auth = authCheck(req.cookies.token)//проверка авторизации пользователя для формы в навигации
        let threads = fs.readdirSync("threads/")
        let rows = rowsCounter(threads);
        let data = "";
            for(let i = 0; i < threads.length; i++){
                let thread = JSON.parse(fs.readFileSync("threads/" + threads[i] + "/" + threads[i] + "_config.json"))
                data += '<article><a href="/thread?id=' + thread.name + '">' + thread.name + '</a><p>' + thread.description + '</p></article>'
            }
        res.render("threads.hbs", {
            body: new hbs.SafeString(data),
            threadsStyles: true,
            auth: auth,
            name: auth.userName
        })
    }

}

module.exports = new threadController