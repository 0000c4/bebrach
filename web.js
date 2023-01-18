function sendRegJSON() { //скрипт регистрации
    let registerForm = document.forms["regForm"];
    let userName = registerForm.elements["userName"].value;
    let pass1 = registerForm.elements["pass1"].value;
    let pass2 = registerForm.elements["pass2"].value;
    //проверка пароля на валидность
    if (pass1 == pass2) {
        // сериализуем данные в json
        let article = JSON.stringify({ userName: userName, password: pass1 });
        let request = new XMLHttpRequest();
        // посылаем запрос на адрес "/user"
        request.open("POST", "/registration", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(article);
        alert("регистрация успешна");
        window.location.replace("/");
    }
    else { alert("пароли не совпадают!"); }
}
function sendThreadJSON() { //скрипт создания треда
    let registerForm = document.forms["threadForm"];
    let head = registerForm.elements["head"].value;
    let body = registerForm.elements["body"].value;
        // сериализуем данные в json
        let article = JSON.stringify({ head: head, body: body });
        let request = new XMLHttpRequest();
        // посылаем запрос на адрес "/user"
        request.open("POST", "/newThread", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(article);
        alert("тред создан");
        location.reload();
}
function sendMsgJSON() { //скрипт создания треда
    let registerForm = document.forms["msgForm"]; 
    registerForm.elements["name"].value = window.location.href.split('=')[1]; //получение текущего адреса и деление его после =
}
function reply(reply_id){
    let registerForm = document.forms["msgForm"];
    registerForm.elements["reply"].value = reply_id;
    document.getElementById("reply").innerHTML = ">>" + reply_id;
    registerForm.elements["msg"].focus();
}
function resetReply(){
    let registerForm = document.forms["msgForm"];
    registerForm.elements["reply"].value = "null";
    document.getElementById("reply").innerHTML = "";
}
function focusMsg(msgID) {
    document.getElementById(msgID).focus();
}
function logout(){
    document.cookie = 'token=; expires=-1';
    window.location.replace("/");
}