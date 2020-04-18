const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var soldierModel = new Schema({
    id: Number,
    soldierName: String,
    soldierMotherName: String,
    soldierImage: String,
    dateOfDeath: String
})

var psalmsModel = new Schema({
    id: Number,
    psalmsName: String,
    psalmsText: String,
})

var indexsModel = new Schema({
    id: Number,
    indexOfSoldiers: Number,
    indexOfPsalms: Number,
    amountOfCommemoration: Number,
    amountOfPsalmsBook: Number
})

module.exports.soldierModel = mongoose.model('soldiers', soldierModel);
module.exports.psalmsModel = mongoose.model('psalms', psalmsModel);
module.exports.indexsModel = mongoose.model('indexs', indexsModel);