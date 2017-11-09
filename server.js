const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const { toAwait } = require('./server/helper');

mongoose.Promise = Promise;

const dbUrl = 'mongodb://localhost:27017/chatapp';
const Message = mongoose.model('Message', {
  name: String,
  message: String
});

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/messages', async (req, res) => {
  const query = Message.find({});
  const [error, data] = await toAwait(query.exec());
  res.send(data);
});

app.get('/messages/:user', async (req, res) => {
  var user = req.params.user;
  const [error, messages] = await toAwait(Message.find({ name: user }));
  if (error) return res.sendStatus(500);
  res.send(messages);
});

app.post('/messages', async (req, res) => {
  const message = new Message(req.body);
  const [saveError, savedMessage] = await toAwait(message.save());
  const [censoredError, censored] = await toAwait(
    Message.findOne({
      message: 'badword'
    })
  );

  if (saveError || censoredError) return res.sendStatus(500);
  if (censored) {
    await Message.remove({ _id: censored.id });
  } else {
    io.emit('message', req.body);
  }

  res.sendStatus(200);
});

io.on('connection', socket => console.log('a user is connected'));

http.listen(3000, () => {
  console.log(`server runs ons port: 3000`);
});

mongoose.connect(dbUrl, { useMongoClient: true }, err => {
  console.log('mongo db connection', err);
});
