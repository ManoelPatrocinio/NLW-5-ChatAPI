import{io} from "../http"
import { ConnectionsService } from "../services/ConnectionsService"
import { MessageService } from "../services/MessageService"

io.on("connect", async(socket)=>{
    const connectionService = new ConnectionsService()
    const messagesService = new MessageService()

    // pega tudas as conexões sem resposta dos adimin/atedente
    const allConnectionWithAdmin = await connectionService.findAllWithoutAdmin()

    //emite para TODOS que estão ouvindo a listagem dos users sem respostas
    io.emit("admin_list_all_users", allConnectionWithAdmin);

    socket.on("admin_list_messages_by_user", async (params, callback) =>{
        const {user_id} = params;
        const allMessages = await messagesService.listByUser(user_id)

        callback(allMessages)
    })


    socket.on("admin_send_message", async (params) =>{
        const {user_id,text} = params;

        await messagesService.create({
            text,
            user_id,
            admin_id: socket.id
        })

        //recupera o id da conexão
        const { socket_id} = await connectionService.findByUserId(user_id) 

        //emite um evento de envio de mensagem para o cliente
        io.to(socket_id).emit("admin_send_to_client",{
            text,
            socket_id: socket.id
        })
    })

    //atualizando a lista dos cleites que estão recebendo suporte
    socket.on("admin_user_in_support", async (params) => {
        const { user_id } = params;
        await connectionService.updateAdminID(user_id, socket.id);
    
        const allConnectionsWithoutAdmin = await connectionService.findAllWithoutAdmin();
    
        io.emit("admin_list_all_users", allConnectionsWithoutAdmin);
      }); 
})