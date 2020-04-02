const express = require('express');
var mongoose = require("mongoose");
const app = express();
app.use(express.urlencoded());

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });
mongoose.connection.on("error", function(e) { console.error(e); });

var schema = mongoose.Schema({
    name: String,
    email: String,
    password: String
  });
 
var Visitor = mongoose.model("Visitor", schema);

app.get('/', (req, res) => {
    Visitor.find({},(err,visitors)=>{
        if(visitors){
            var html=`
            <a href="http://localhost:3000/register">Registrarse</a>
            <table>
            <thead><tr>
                <th>Nombre</th>
                <th>Email</th>
            </tr></thead>`;
            visitors.forEach(visitor => {
                html+=`
                <tr>
                    <td>${visitor.name}</td>
                    <td>${visitor.email}</td>
                </tr>`;
            });
            html+=`</body></table>`;
            res.send(html);
        }
    });
});

app.get('/register', (req, res) => {
    res.send(`
    <!DOCTYPE html>
        <html lang="es" dir="ltr">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Formulario de registro</title>
        </head>
        <body style="width:100%;">
            <form action="/register" method="post" style="width: 320px; display: flex; flex-direction:column; margin:auto;">
                <h3>Registrate aquí!</h3>
                <label for="name">Nombre:</label>
                <input type="text" name="name" id="name">
                <label for="mail">Correo electrónico:</label>
                <input type="email" name="email" id="email">
                <label for="msg">Password:</label>
                <input type="password" name="password" id="password">
                <input type="submit" value="Registrarse" style="margin-top:15px;">               
            </form>
        </body>
    </html>
    `);
  });

app.post('/register', (req, res) => {
    
    if(req.body.name && req.body.email && req.body.password){
        var visitor = new Visitor({ name:req.body.name, email:req.body.email, password:req.body.password});
        visitor.save(function(err, newVisitor){
            if(err){
                res.send("Error en el servidor"); 
            }
            else{
                if(!newVisitor){
                    res.send("Usuario NO registrado"); 
                }
                else{
                    res.redirect("/");
                }
            }
        });
    }
    else{
        res.redirect("/register");
    }
});



app.listen(3000, () => console.log('Listening on port 3000!'));