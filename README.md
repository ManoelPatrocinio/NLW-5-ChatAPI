# NLW-5-ChatAPI

API para char de mensagens com o cliente

=========================== TECNOLOGIAS USADAS  ===========================
        TypeScript
        Sqlite
        Express
        webSocket


=========================== COMANDOS USADOS ===========================

    yarn init -Y                                            => criar o arquivos package.json
    yarn add express                                        => install dependencia express: micro-framework(rotas,server)
    yarn add @types/express -D                              => garante acesso as bibliotecas do express
    yarn add typescript -D                                  => install o TypeScript
    yarn tsc --init                                         => inicia o TypeScript dentro da aplicação
    yarn add ts-node-dev -D                                 => Converte o code TypeScript em Js em tempo de execução
    yarn dev                                                => Iniciar o server 
    yarn add typeorm reflect-metadata sqlite3               => add o typeorm(relaciona um objeto a um campo do bd) e sqlite3
    yarn add uuid                                           => add biblioteca do uuid(id randomico universal)
    yarn add @types/uuid -D                                 => add tipagem uuid
    yarn typeorm migration:create -n CreateSettings         => add migration de settings
    yarn typeorm migration:create -n CreateUsers
    yarn typeorm migration:create -n CreateMessages
    yarn add socket.io                                      => add biblioteca do socket io
    yarn add @types/socket.io -D                            => add tipagem socket.io 
    yarn add ejs
    yarn add socket.io-client
    

=========================== COMENTÁRIOS ===========================

no arquivo tsconfig = "strict": false : desativa verificação no momento do desenvolvimento 