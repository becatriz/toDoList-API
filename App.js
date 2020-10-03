const Express = require('express');
const { ObjectID } = require('mongodb');
const app = new Express()
const PORT = 3000

const cors = require('cors')
app.use(cors())

//-------------------Inicio conexão Banco de Dados------------------------------------------//
//-------------------TODO: Tirar daqui pelo amor da Deusa------------------------------------//
const MongoClient = require('mongodb').MongoClient;
const DB_NAME = 'todolist-db';
const DB_URL = `mongodb+srv://rebekika:BXfNI1gJ3JJYfbbm@cluster0.obsf2.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
let connection
let db
let tarefasCollection

MongoClient.connect(DB_URL, function (err, client) {

  if (err) {
    console.log("Erro de conexão ao Banco de dados");
    process.exit(0)
  } else {
    console.log("Banco de dados Conectado com Sucesso");
    connection = client
    db = connection.db(DB_NAME)
    tarefasCollection = db.collection('tarefas')
  }

});

//-------------------Fim conexão Banco de Dados---------------------------------------------//

app.use(Express.json())

app.get('/', (req, res) => {
  res.send('Home');
});

//Cadatro de Tarefas
app.post('/tarefas', async (req, res) => {
  const resultado = await tarefasCollection.insertOne(req.body)
  res.json(resultado);
});

//Edição de Tarefas
app.put('/tarefas', async (req, res) => {

  const resultado = await tarefasCollection.updateOne(
    { _id: ObjectID(req.body._id) },
    {
      $set: {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        concluida: req.body.concluida
      }
    },
    { upsert: true }
  )
  res.json(resultado);
});

//Remoção de Tarefas
app.delete('/tarefas/:id', async (req, res) => {
  const resultado = await tarefasCollection.deleteOne({ _id: ObjectID(req.params.id) })
  res.json(resultado);
});

//Listagem de Tarefas
app.get('/tarefas', async (req, res) => {
  if (req.query.titulo) {
    res.json(
      await tarefasCollection.find({ titulo: { $regex: `${req.query.titulo}.*?`, $options: 'i' } }).toArray()
    )
  }
  else res.json(
    await tarefasCollection.find().toArray()
  )
});

app.listen(PORT, () => {
  console.log(`API rodando na porta: ${PORT}`)
});






