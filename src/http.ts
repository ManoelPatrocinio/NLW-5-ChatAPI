import express, { request, response } from "express";
import "./database";
import {routes} from "./routes"
import {createServer} from "http";
import {Server,Socket} from "socket.io";
import path from "path"

const app = express();

app.use(express.static(path.join(__dirname, "..","public"))) //define o comaninho do arquivos publicos
app.set("views",path.join(__dirname, "..","public"))
app.engine("html", require("ejs").renderFile);
app.set("view engine","html");

app.get("/pages/client",(request,response)=>{
    return response.render("html/client.html")
})

app.get("/pages/admin",(request,response)=>{
    return response.render("html/admin.html")
})

const http = createServer(app); //criar protocolo htttp
const io = new Server(http); //criar protocolo ws

io.on("connection", (socket: Socket) =>{ //primeiro acesso ao socket
    console.log("se conectou", socket.id)
}) 

app.use(express.json())
app.use(routes)


export {http, io}