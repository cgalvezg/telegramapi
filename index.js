const { NewMessage } = require ("telegram/events");
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const  input = require ('input');
const fs = require("fs");
const { betterConsoleLog } = require("telegram/Helpers");
const RUTA = "./base_de_datos.json";
var cron = require('node-cron');
var text = fs.readFileSync("./chistes.txt").toString('utf-8');
var chisteRandom = text.split("---");
let botEncendido = false;


let baseDeDatos = read(RUTA);
//cxv


const apiId = 25828712;
const apiHash = '3220a7b5406658ac1f9209bae24dd8cd';
const stringSession = new StringSession("1BAAOMTQ5LjE1NC4xNjcuOTEAUGijtd3G3sfi99YYaKdlc6Mjt/ErmL8IOmK2Y9nX1RGU2EI/SzLAzirfzw7goG2kFc/hiVPXVeDoxp5FaAB5zQ7Cq2qTX2ZeVsCNYavyX9Bj+JygKmzqR9aKY4Uj3j7u+8VMkirjb/MzdCuucpvtWkxOA2GUvbIA1z4DRwUOdBpw/Z5UgI18+NAlPq4nHaXY+Ry9v8vcxq34+bCMJkpl2XPy0HlFpBJnpDUY4c0Is33QsTSUyHxpXDgHP4eWwGjuZo/EvjQ8IWFtwW0tbaI4sXXUGQBhs1FhZAuLMyU3g4QLG8dUpTIvTLu5luFBiNMYY/J6xapKtwuvMkbs3HY+8l8="); // fill this later with the value from session.save()
const cafeta = "-1001026904390";
let dato =[]   
let stringMensajes = [] 

    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
      });
      (async () => {

      await client.start({
        phoneNumber: async () => await input.text("Please enter your number: "),
        password: async () => await input.text("Please enter your password: "),
        phoneCode: async () =>
          await input.text("Please enter the code you received: "),
        onError: (err) => console.log(err),
      });
      console.log("You should now be connected.");
      await client.sendMessage("me", { message: "Hello!" });
    })();

        async function eventHandler(event) {                    
                    const message = event.message;
                    const sender = await message.getSender(); 
                    const id = event.chatId.toString();
                    //console.log("Sender:",sender.username, "|| Message:", message.text);   
                    
                    if (message.text == "/start"){                                       
                        botEncendido = true;
                    }

                    if (message.text == "/stop"){                                       
                        botEncendido = false;
                    }

                    if (botEncendido){       
                            if (message.text == "/hello"){                                       
                                await client.sendMessage(id,{message:`hi your id is ${message.senderId}`
                                });
                            }

                            if (message.text == "/stats"){                                               
                                getStats(id);
                                //writeToBD();                            
                            }

                            if (message.text == "/help"){                                       
                                await client.sendMessage(id,{message:
                                    'Ayuda\n'+
                                    '-----------\n'+
                                    '/stats: estadisticas\n'+
                                    '/hello: te devuelve tu id\n'+
                                    '/help: ayuda'+
                                    '/chiste: te cuenta un chiste'                         
                                });
                            }

                            if ((message.text.includes("gilipoyas")) || (message.text.includes("idiota")) || (message.text.includes("capullo"))) {                                       
                                await client.sendMessage(id,{message:":::Bot de pochi::: Ojo con las palabrotas!"});
                                //console.log(message.chat.id);
                                //console.log(event);                        
                            }



                            if (message.text == "/chiste"){ 
                                var random = Math.floor(Math.random()*chisteRandom.length);                        
                                await client.sendMessage(id,{message:chisteRandom[random]});
                            }
                    }

                }  


client.addEventHandler(eventHandler, new NewMessage({}));

//funciones lectura/escritura
//cuando leemos debemos deserializar el JSON string a un objeto
//javascript plano antes de manipular los datos

function read(ruta) {
    //data se lee en formato raw data (hex). readFileSync lo hace de manera sincrona
    const data = fs.readFileSync(ruta).toString();
    //se parsean los datos a JSON 
    return JSON.parse(data);
}

function write(ruta, objeto) {
    //JSON.stringify lo que hace es pasar un JSON object a JSON string antes de escribirlo en el fichero
    //con null, 2 lo que hace es indentarlo y darle saltos de linea
    const data = fs.writeFileSync(ruta, JSON.stringify(objeto, null, 2));
}

async function getStats(sender){
    let mensajeFinal = "";
    let mensajesTotales = 0                           
    var medianoche
    mensajesTotales = 0
    mensajeFinal = []
    estadisticas = []
    usuarios = []  
     

    //el formato de fecha es la de unix epoch                                                                              
    var medianoche = new Date().setHours(0,0,-1);
    nose = Math.floor((new Date(medianoche)).getTime()/1000); 

    var d = new Date(medianoche);
    d = (d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds())   
                        
    for await (mensaje of client.iterMessages(cafeta)){
        if (mensaje.date < nose) break;
        mensajesTotales = mensajesTotales + 1;                                 
        const usuario = await mensaje.getSender();
        usuarios.push(usuario.username)                           
    }
  
    var counts = {};                           
    usuarios.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });                         

    let sortable = [];
    for (var nombre in counts) {
        sortable.push([nombre, counts[nombre]]);
    }
    
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });

    let objSorted = {}
    sortable.forEach(function(item){
        objSorted[item[0]]=item[1]
    })                           

    for (var nombre in objSorted) {                             
        ganador = nombre
        break;
    }

    for (var nombre in objSorted) {                            
        estadisticas = estadisticas + nombre +": "+objSorted[nombre]+"\n";        
        stringMensajes.push({usuario:nombre, cantidad:objSorted[nombre]});
    }

    dato = {fecha:d, ganador:ganador,mensajes: stringMensajes}    

    mensajeFinal = '**:::BOT de Pochirambo:::**\n'
    mensajeFinal = mensajeFinal + '**:::Vamos a ver las estadisticas de hoy!!:::**\n\n'
    mensajeFinal = mensajeFinal + estadisticas + "\n\n"
    mensajeFinal = mensajeFinal + "Hoy se han enviado "+mensajesTotales+ " mensajes.\n"
    mensajeFinal = mensajeFinal + "El ganador de hoy es "+ ganador + "!!"

    if (sender != "me"){
        await client.sendMessage(sender,{message:mensajeFinal});  
    }
}

async function writeToBD(){    
    console.log("escribiendo en la BD....");
    baseDeDatos.push(dato);       
    write(RUTA, baseDeDatos);
    console.log("terminado..");
}


cron.schedule("30 59 23 * * *", function() {
    console.log("Recuperando estadisticas a las 23:59");
    console.log(new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" }));
    getStats("me");
    writeToBD();
  });


