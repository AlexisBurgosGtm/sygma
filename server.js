
process.loadEnvFile() //process.loadEnvFile(['./dev.env','./dev2.env'])


var express = require("express");
var axios = require('axios');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

var nodemailer = require('nodemailer');


const execute = require('./connection');

var router_config = require('./router/router_config.js');
var router_contabilidad = require('./router/router_conta.js');
var router_general = require('./router/router_general');
var router_sucursales = require('./router/router_sucursales');
var router_empleados = require('./router/router_empleados');
var router_productos = require('./router/router_productos');
var router_pos = require('./router/router_pos');
var router_compras = require('./router/router_compras');
var router_inventarios = require('./router/router_inventarios.js')
var router_reportes = require('./router/router_reportes');
var router_despacho = require('./router/router_despacho');
var router_ordenes = require('./router/router_ordenes');
var router_equipos = require('./router/router_equipos');
var router_clientes = require('./router/router_clientes');
var router_proveedores = require('./router/router_proveedores.js');
var router_tipodocumentos = require('./router/router_tipodocumentos');
var router_cajas = require('./router/router_cajas');
var router_documentos = require('./router/router_documentos');
var router_bi = require('./router/router_bi')
var router_clasificaciones = require('./router/router_clasificaciones')
var router_usuarios = require('./router/router_usuarios.js')



var http = require('http').Server(app);
//var io = require('socket.io')(http);
var io = require('socket.io')(http, { cors: { origin: '*' } });


const cors = require('cors');
app.use(cors({
    origin: '*'
}));


const PORT = process.env.PORT || 3003;

//app.use(bodyParser.json());
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', extended: true}));


app.use(express.static('build'));

var path = __dirname + '/'

//manejador de rutas
router.use(function (req,res,next) {
  
  next();
});



app.post("/enviar_mail",function(req,res){
  
    const {destino,msg,motivo} = req.body;


    //Creamos el objeto de transporte
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'pym.notificaciones@gmail.com',
        pass: 'gdjysyxrpzcgedyd'  //$ystems2023
      }
    });

   

    var mensaje = msg;

    var mailOptions = {
      from: 'pym.notificaciones@gmail.com', 
      to: destino,
      subject: motivo,
      text: mensaje
    };

    

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log('Error al enviar correo: ')
        console.log(error);
         res.send('error');
      } else {
        console.log('Email enviado: ' + info.response);
         res.send('enviado');
      }
    });

	 



}); 




app.get("/",function(req,res){
  
 

	res.sendFile(path + 'index.html');
}); 



app.post("/activate_config_count_rows",function(req,res){
  let qry = `
  EXEC sys.sp_configure N'user options', N'0';
  RECONFIGURE WITH OVERRIDE;
  `;

  execute.Query(res,qry);

})

app.get("/login",function(req,res){
  res.redirect('/');
}); 

// DESPACHO //

app.get("/despacho",function(req,res){

    const {empnit,coddoc,correlativo} = req.query;


    console.log(req.query);

    io.emit('nuevo_despacho', empnit,coddoc,correlativo);

    res.send('ok')

}); 

app.get("/despacho_finalizado",function(req,res){

  const {empnit,coddoc,correlativo} = req.query;

  io.emit('fin_despacho', empnit,coddoc,correlativo);

  res.send('ok')

}); 




//Router 
app.use('/config', router_config);
app.use('/general', router_general);
app.use('/conta', router_contabilidad);
app.use('/sucursales', router_sucursales);
app.use('/empleados', router_empleados);
app.use('/productos', router_productos);
app.use('/cajas', router_cajas);
app.use('/pos', router_pos);
app.use('/compras', router_compras);
app.use('/inventarios', router_inventarios);
app.use('/reportes', router_reportes);
app.use('/despacho', router_despacho);
app.use('/ordenes', router_ordenes);
app.use('/equipos', router_equipos);
app.use('/clientes', router_clientes);
app.use('/proveedores', router_proveedores);
app.use('/tipodocumentos', router_tipodocumentos);
app.use('/documentos', router_documentos);
app.use('/bi', router_bi);
app.use('/clasificaciones', router_clasificaciones);




app.use("/",router);

app.use("*",function(req,res){
  res.redirect('/');
  //res.send('<h1 class="text-danger">NO DISPONIBLE</h1>');
});




// SOCKET HANDLER
io.on('connection', function(socket){

      socket.on('MODO_SAT', (clave)=>{
        execute.Query_system(`UPDATE SYSTEM_CONFIG SET ACTIVO='SI' WHERE CODIGO='MODO_SAT';`);
        io.emit('MODO_SAT', clave);

      });
  
      socket.on('notificacion', (tipo,msn)=>{
        io.emit('notificacion', tipo, msn);
      });

      socket.on('nueva_cotizacion', (tipo,msn)=>{
        io.emit('nueva_cotizacion', tipo, msn);
      });

      
  
});


http.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});

