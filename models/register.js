const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RegisterSchema = Schema({
    campaing: {
        type: 'ObjectId',
        ref: 'Campaing',
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    }
});
module.exports = mongoose.model('Register', RegisterSchema);