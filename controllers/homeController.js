
module.exports.index = (req,res) => {
    let user = req.user;
    res.render('home',{title:'home',alert: false,user})
}