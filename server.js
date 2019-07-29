const express = require('express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const cors = require('cors');
const multer  = require('multer');

mongoose.connect('mongodb+srv://noPainNoGain:noPainNoGain@cluster0-weose.mongodb.net/campaings?retryWrites=true', {useNewUrlParser: true});

const server = express();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}

server.use(cors(corsOptions));

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

const upload = require('./upload');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/var/tmp')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
const uploadMulter = multer({ storage: storage });

server.post('/upload', uploadMulter.single('file'), upload);

server.listen(8000, () => {
  console.log('Server started!')
})