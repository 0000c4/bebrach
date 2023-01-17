const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./model')
const key = require('./key')
function generateAccessToken(id, userName){
    const payload = {
        id,
        userName
    }
    return(jwt.sign(payload,key))
}
class controller {
    async login(req, res) {
        try {
            console.log(req.body.userName)
            const user = await User.findOne({ user: req.body.userName })//поиск по имени
            console.log(user)
            if (!user) {//если пользователь не существует
                console.log('no users with that email')
            }
            //если существует проверить пароль
            if (await bcrypt.compare(req.body.password, user.password)) {//если пароли совпадают
                console.log('авторизация успешна')
                const token = generateAccessToken(user._id, user.user)
                res.cookie("token", token);
                res.redirect("/");
            }
            else { console.log("неверный пароль") }//если нет
        } catch (error) {
            console.log(error)
        }
    }
    async registration(req,res){
        try {
            const hashedPassword = await bcrypt.hash(req.body.password,10)
            const user = new User({user: req.body.userName, password: hashedPassword})
            const data = await user.save();
            console.log(data)
            res.redirect("/")
        } catch {
            res.redirect("/registration")
        }
    
    }
}

module.exports = new controller();