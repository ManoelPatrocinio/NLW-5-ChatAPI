import { Socket } from "socket.io";
import { Connection } from "../entities/connection";
import{io} from "../http";
import {ConnectionsService} from "../services/ConnectionsService"
import { MessageService } from "../services/MessageService";
import {UserService} from "../services/UserService"

interface IParams{
    text: string;
    email: string;
}

io.on("connect",(socket)=>{
    const connectionsService = new ConnectionsService();
    const usersService = new UserService();
    const message = new MessageService();
    let user_id = null 

    //estabelecendo primeiro conexão
    socket.on("client_first_access", async(params)=>{
        const socket_id = socket.id; //rec id da conexão
        const{email,text} = params as IParams ;

        const userExist = await usersService.findByEmail(email)


        if (!userExist) { //se o usuario não existir, o cria e recolher o id
            const user = await usersService.create(email)
            
            await connectionsService.create({
                socket_id,
                user_id: user.id
            })

            user_id = user.id

        } else {
            user_id = userExist.id
            const connection = await connectionsService.findByUserId(userExist.id) // verificasse já existe uma conexão  

            if (!connection) { //se não existe, é criado uma
                await connectionsService.create({
                    socket_id,
                    user_id:userExist.id
                })
                
            } else {
                connection.socket_id = socket_id // sobreecreve o is da conexão
                await connectionsService.create(connection )//salva no  bd
            }
        }

        // processo para salvar as mensagens
        await message.create({
            text,
            user_id
        })
        
        //resgata todas as mensagens
        const allMessages = await message.listByUser(user_id);

        //emite um evento p/ listagem
        socket.emit("client_list_all_messages",allMessages)

    })

    socket.on("client_send_to_admin", async (params) => {
        const { text, socket_admin_id } = params;

        const socket_id = socket.id;

        const { user_id } = await connectionsService.findBySocketID(socket_id);

        const messages = await message.create({
        text,
        user_id,
        });

        io.to(socket_admin_id).emit("admin_receive_message", {
        messages,
        socket_id,
        });

        // Melhorias
    });

  socket.on("disconnect", async () => {
    console.log(socket.id);
    await connectionsService.deleteBySocketId(socket.id);
  });

})