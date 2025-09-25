
try {
  process.loadEnvFile() //process.loadEnvFile(['./dev.env','./dev2.env'])
  
} catch (error) {
  
}



var express = require("express");
var axios = require('axios');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

var nodemailer = require('nodemailer');


const execute = require('./connection');

var router_objetivos = require('./router/router_objetivos.js');
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
var router_bi = require('./router/router_bi');
var router_clasificaciones = require('./router/router_clasificaciones');
var router_repartidor = require('./router/router_repartidor.js');
var router_usuarios = require('./router/router_usuarios.js');



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


app.post('/guatex_guia', function(req,res){

  const {
      nombre_destinatario,telefono_destinatario,direccion_destinatario,codmunicipio,descripcion,recoge_oficina,
      codigo_cobro,codigo_destino,json_items
        } = req.body;



        let items = JSON.parse(json_items);
        
        let strItems = ''
        items.map((r)=>{
          strItems += `{"piezas":"${r.PIEZAS}","tipoEnvio":"${r.TIPO}","peso":"${r.PESOLBS}"},`
        })

        strItems = `[${strItems.substring(0, strItems.length - 1)}]`;

       

        let json = JSON.parse(strItems);

        
   
      let data = {
          usuario: "APIGUATEX",
          password: "GTXADMINGT",
          codigoCobro: "CON1289",
          tipoUsuario: "C",
          nombreRemitente: "PRUEBA API SUMINISTROS PORCINOS",
          direccionRemitente: "14 AV 4-11 ZONA 12 GUATEMALA GUATEMALA",
          telefonoRemitente: "31313131",
          codigoOrigen: "223",
          generaZPL: "S",
          generaPDF: "N",
          estaListo: "S",
          guias: [
              {
                  llaveCliente: "GBR",
                  nombreDestinatario: nombre_destinatario,
                  telefonoDestinatario: telefono_destinatario,
                  direccionDestinatario: direccion_destinatario,
                  municipioDestino: codmunicipio,
                  descripcionEnvio: descripcion,
                  recogeOficina: recoge_oficina,
                  codigoCobroGuia: codigo_cobro,
                  codigoDestino: codigo_destino,
                  lineasDetalle: json
              }
          ]
      
      }

    

      axios.post('https://guias.guatex.gt/tomarservicio/servicio', data)
      .then((response) => {
        
        
            let zpl = response.data.serviciosGenerados[0].zpl;
            let noguia = response.data.serviciosGenerados[0].noguia;

            console.log('guia:')
            console.log(noguia);


            get_zpl_pdf(zpl,noguia)
            .then((data)=>{
                res.send(data);
            })
            .catch(()=>{
                res.send('error');
            })
            
        //res.send(noguia);

      }, (error) => {
          console.log('error al generar guia')
          console.log(error);
            res.send('error');

      });



});


function get_zpl_pdf(zplcode,noguia){

    return new Promise((resolve,reject)=>{

      var fs = require('fs');
      var request = require('request');

      var zpl = zplcode; //"^xa^cfa,50^fo100,100^fdHello World^fs^xz";

      var options = {
          encoding: null,
          formData: { file: zpl },
          // omit this line to get PNG images back
          headers: { 'Accept': 'application/pdf' },
          // adjust print density (8dpmm), label width (4 inches), label height (6 inches), and label index (0) as necessary
          url: 'http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/'
      };

      request.post(options, function(err, resp, body) {
          
            if (err) {
                console.log(err);
                reject();
            }

            var filename = noguia + '.pdf'; // change file name for PNG images
            fs.writeFile(filename, body, function(err) {
                if (err) {
                    console.log(err);
                    reject();
                }else{
                  resolve(filename);
                };
                

            });
            
      });

    })
    
       
};



app.post('/guatex_destinos', function(req, res) {

    let qry = `
      SELECT ID,CODIGO_DESTINO,
      NOM_DESTINO,MUNICIPIO,DEPARTAMENTO,
      COD_DEPTO,COD_MUN,DIR_AGENCIA
        FROM GUATEX_DESTINOS_MUNICIPIOS
    `

    execute.QueryToken(res,qry,'');


});

app.get('/guatex_municipios', function(req, res) {

      let xmls = `
        <soapenv:Envelope 
          xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
          xmlns:ser="http://servicio.wsmunicipiosgtx.guatex.com/">
          <soapenv:Header/>
          <soapenv:Body>
            <ser:consultarMunicipios>
              <xmlCredenciales>
                <CONSULTA_MUNICIPIOS>
                  <USUARIO>APIGUATEX</USUARIO>
                  <PASSWORD>GTXSP24</PASSWORD>
                  <CODIGO_COBRO>CON1289</CODIGO_COBRO>
                </CONSULTA_MUNICIPIOS>
              </xmlCredenciales>
            </ser:consultarMunicipios>
          </soapenv:Body>
        </soapenv:Envelope>
      `;

      axios.post(
        'https://jcl.guatex.gt/WSMunicipiosGTXGF/WSMunicipiosGTXGF',
        xmls,
        {
          headers: {
            'Content-Type': 'text/xml',
            'SOAPAction': 'http://servicio.wsmunicipiosgtx.guatex.com/consultarMunicipios'
          }
        }
      )
      .then(response => {
          
          console.log(response.data);
          res.send(response.data);

      })
      .catch(err => {
          
          console.error(err);
          res.status(500).send(err);

      });

});

app.get('/guatex_tracking', function(req, res) {

  const {noguia} = req.query;

  let xmls = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.tracking.guatex.com/">
      <soapenv:Header/>
        <soapenv:Body>
          <ws:consultaws>
            <!--Optional:-->
            <noguia>${noguia}</noguia>
          </ws:consultaws>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

  axios.post(
    'https://jcl.guatex.gt/WSTracking/WSTracking',
    xmls,
    {
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': 'http://ws.tracking.guatex.com/'
      }
    }
  )
  .then(response => {
      
      console.log(response.data);
      res.send(response.data);

  })
  .catch(err => {
      
      console.error(err);
      res.status(500).send(err);

  });

});

app.get('/guatex_guia_pdf', function(req, res) {

  const {filename} = req.query;

  let rutaarchivo = path + filename;
  
  res.download(rutaarchivo);

});





//Router 
app.use('/objetivos', router_objetivos);
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
app.use('/repartidor', router_repartidor);



app.use("/",router);

app.use("*",function(req,res){
  res.redirect('/');
  //res.send('<h1 class="text-danger">NO DISPONIBLE</h1>');
});




// SOCKET HANDLER
io.on('connection', function(socket){


      socket.on('nueva_devolucion_reparto', (codemp,cliente,importe)=>{

          io.emit('nueva_devolucion_reparto', codemp,cliente,importe);
      });

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

