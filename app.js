require('dotenv').config();
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const Logguer = require('./logguer/logger');
const port = process.env.PORT
const routes = require('./routes/rutes')
app.set('view engine', 'ejs');
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('/public'));
app.use(expressLayouts);
app.use(routes);
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/sweetalert2/dist'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/icons', express.static(__dirname + '/node_modules/bootstrap-icons/font'));

app.listen(port, ()=>{
    Logguer.info('App Started with port: '+port)
})