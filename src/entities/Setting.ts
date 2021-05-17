import {Entity, Column, CreateDateColumn, UpdateDateColumn,PrimaryColumn} from "typeorm";
import  {v4 as uuid} from "uuid"; //gera o id com números aleatórios 
 

@Entity("settings")
class Setting{
    
    @PrimaryColumn()
    id:string;
    
    @Column()
    username: string;
    
    @Column()
    chat: boolean;
    
    @UpdateDateColumn()
    updated_at:Date;
    
    @CreateDateColumn()
    created_at: Date;

    // verifica a existencia do id, para evitar sobrescrever durante um update
    constructor(){
        if (!this.id) {
            this.id = uuid();
        }
    }

}

export {Setting}