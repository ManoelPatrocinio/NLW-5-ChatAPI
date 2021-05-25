import { getCustomRepository, getRepository, Repository } from "typeorm"
import { Connection } from "../entities/connection"
import {ConnectionsRepository} from "../repositories/connectionsRepository"

interface IConnectionCreate{
    socket_id:string;
    user_id: string;
    admin_id?: string;
    id?:string;
}

class ConnectionsService{
    private connectionRepository: Repository<Connection>
    constructor(){
        this.connectionRepository = getCustomRepository(ConnectionsRepository)
    }

    async create({socket_id,user_id,admin_id,id}:IConnectionCreate){
        const connection = this.connectionRepository.create({
            socket_id,
            user_id,
            admin_id,
            id
        });

        await this.connectionRepository.save(connection)

        return connection
    }


    async findByUserId(user_id:string){
        const connection = await this.connectionRepository.findOne({
            user_id,
        })
        return connection 
    }

    //buscar os usuarios não atendidos
    async findAllWithoutAdmin(){
        const connetioin = await this.connectionRepository.find({
            where: { admin_id:null},
            relations: ["user"],
        })

        return connetioin
    }

    //busca uma conexão pelo id
    async findBySocketID(socket_id: string) {
        const connection = await this.connectionRepository.findOne({
          socket_id,
        });
    
        return connection;
    }
    
    //atualiza a lista dos cliente não atendidos 
    async updateAdminID(user_id: string, admin_id: string) {
        await this.connectionRepository
          .createQueryBuilder()
          .update(Connection)
          .set({ admin_id })
          .where("user_id = :user_id", {
            user_id,
          })
          .execute();
    }
    
    //deleta uma conexão
    async deleteBySocketId(socket_id: string) {
        await this.connectionRepository
          .createQueryBuilder()
          .delete()
          .where("socket_id = :socket_id", {
            socket_id,
          })
          .execute();
    }
}

export{ConnectionsService}