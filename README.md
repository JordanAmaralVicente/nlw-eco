# NLW Ecoleta - Jordan

Projeto da Next Level da Rockseat. Decidi fazer somente a parte do desenvolvimento web e fazer algumas adições em vez de desenvolver para dispositivos mobiles. O projeto ainda não está 100% finalizado, porém até aonde testei, está funcionado. 

# Como executar ?
Primeramente, você precisa ir no arquivo /server/knexfile.ts e mudar as varíaveis do banco de dados, pois ainda não criei algum arquivo .Env ou fiz alguma instância do docker (Não ainda)

Após isso:
```bash
cd server
npm run knex:migrate
npm run knex:seeds
npm start:server

#O server estará online,agora é o web
cd ../web
npm build
npm start
```

por padrão, o servidor está rodando na porta 3001 e a interface web na 3000