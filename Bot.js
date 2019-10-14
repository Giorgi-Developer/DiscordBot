const http = require("http");const express = require("express");const app = express();app.use(express.static("public"));app.get("/", function(request, response) {response.sendFile(__dirname + "/views/index.html");});app.get("/", (request, response) => {response.sendStatus(200);});app.listen(process.env.PORT);setInterval(() => {http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);}, 280000);

//--------------------------------------BOT---------------------------------------------- //

const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

let prefix; prefix = process.env.PREFIX; // Definimos el prefijo, para tener el prefijo del archivo .env tienes que colocar `process.env.PREFIX` y en el .env colocar `PREFIX=tuprefix`

client.on('warn', err => console.warn('[WARNING]', err));

client.on('error', err => console.error('[ERROR]', err));

// Aquí se seleccionan algunos de los textos que aparecerán en la presencia de nuestro bot, en un array/arreglo e ir metiendo todos
const actividades = [
    ".",
    "Fase Pruebas",
    "Bot Base",
    client.guilds.size + " servidores y " + client.users.size + " usuarios 👥"
    ];

// El evento ready nos servirá para realizar algunas acciones justo en el momento cuando el bot se inicia
client.on('ready', () => {

// Registraremos cuando el bot se active, un mensaje en la consola 
console.log(`Estoy prendido y listo para funcionar\nSesión iniciada como: "${client.user.tag}"`)

// Esto hará el intervalo de las presencias, las presencias ahora son aleatorias y tienen un intervalo de 20000 milisegundos (20 segundos)
    setInterval(() => {
        const index = Math.floor(Math.random() * (actividades.length - 1) + 1);
        client.user.setPresence({
        status: "online",
        game: {
            name: actividades[index],
            type: "WATCHING"
        }
    })
    }, 5000);
});

// Empezaremos a crear el command handler

client.comandos = new Discord.Collection()


let archivos = fs.readdirSync("./comandos").filter((f) => f.endsWith(".js"))

for (var archi of archivos) {
  let comando = require("./comandos/"+archi);
  client.comandos.set(comando.nombre, comando)
  console.log(archi + "fue cargado correctamente")
}


client.on("message", message => {

// Definimos args que serán los argumentos, algo que nos será muy util para todo nuestro bot
const args = message.content.slice(prefix.length).trim().split(/ +/g);

// Creamos nuestros comandos utilizando la variable command para asegurarnos de no tomar el primer elemento de la matriz, el prefijo y solo devuelva el comando
const command = args.shift().toLowerCase()

if (message.author.bot) return; // Esto nos ayuda a evitar un bucle de mensajes sin fin, si el autor del mensaje es un bot no devuelve nada, o sea, no hace ninguna acción

if (!message.guild || !message.content.startsWith(prefix)) return; // Si el comando NO se ejecutó en un servidor o si el mensaje no empieza con el prefijo no devuelve nada

let cmd = client.comandos.get(command) || client.comandos.find((c) => c.alias.includes(command))
if (cmd) {
  return cmd.run(client, message, args)
}

});

client.login(process.env.TOKEN) // Iniciamos la sesión del bot con el método "login" usando la token que, en nuestro caso está privada, la puedes obtener en la página de developers de Discord
// Si usas Glitch como en este caso para tener el token del archivo .env tienes que colocar `process.env.TOKEN` y en el .env colocar `TOKEN=TUTOKENSECRETO`