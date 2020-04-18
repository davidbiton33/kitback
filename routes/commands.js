const express = require('express');
const router = express.Router();

var conection = require('../data/database');
var models = require('../model/models');


/*********************************************************** SOLDIERS ***********************************************************/

/****************************************************/
//                set a new soldier                 //
// get data    = > 
//                soldier name
//                soldier mother name
//                soldier image
//                date of death
/****************************************************/
router.post('/set-soldiers', async (req, res) => {
    try {
        //log.info("Get action to set a new soldier");

        //update this sodiers data in DB
        var post = new models.soldierModel({
            id: 1,
            soldierName: req.body.soldierName,
            soldierMotherName: req.body.soldierMotherName,
            soldierImage: req.body.soldierImage,
            dateOfDeath: req.body.dateOfDeath
        });

        post.save().then(() => 'soldier saved in database');

        res.send(true);
    } catch (ex) {
        //log.error(ex.message);
        res.status(500).send(ex.message);
    }
});


/**************************************************/
//                gat all soldiers                //
/**************************************************/
router.get('/get-soldiers', async (req, res) => {
    try {
        //log.info("Get action to get all soldiers");

        //get all sodiers data from DB
        models.soldierModel.find({}, (err, data) => {
            if (err) {
                console.log('err from find soldiers');
                console.log(err)
            } else {
                res.send(data)
            }
        });
    } catch (ex) {
        //log.error(ex.message);
        res.status(500).send(ex.message);
    }
});




/*********************************************************** PSALMS ***********************************************************/

/****************************************************/
//                set a new psalms                 //
// get data    = > 
//                psalms name
//                psalms text
/****************************************************/
router.post('/set-psalms', async (req, res) => {
    try {
        // log.info("Get action to set a new psalms");

        //update this psalms data in DB
        var post = new models.psalmsModel({
            id: 1,
            psalmsName: req.body.psalmsName,
            psalmsText: req.body.psalmsText,
        });

        post.save().then(() => 'psalms saved in database');

    } catch (ex) {
        //log.error(ex.message);
        res.status(500).send(ex.message);
    }
});


/************************************************/
//                gat all psalms                //
/************************************************/
router.get('/get-psalms', async (req, res) => {
    try {
        //log.info("Get action to get all psalms");

        //get all psalms data from DB
        models.psalmsModel.find({}, (err, data) => {
            if (err) {
                console.log('err from find psalms');
                console.log(err)
            } else {
                res.send(data)
            }
        });
    } catch (ex) {
        //log.error(ex.message);
        res.status(500).send(ex.message);
    }
});






/*********************************************************** ACTION ***********************************************************/

/*******************************************************************************************************/
//                get amount of soldiers that commemorated & num of book that was reading              //
/*******************************************************************************************************/
router.get('/get-num-of-soldiers-that-commemorated&num-of-book-that-was-reading', async (req, res) => {
    try {
        //log.info("Get action to get amount of soldiers that commemorated & num of book that was reading");

        //get amount of soldiers that commemorated & num of book that was reading
        models.indexsModel.find({}, (err, data) => {
            if (err) {
                console.log('err from find indexs');
                console.log(err)
            } else {
                res.send(data)
            }
        });

    } catch (ex) {
        // log.error(ex.message);
        res.status(500).send(ex.message);
    }
});


/********************************************************/
//                get a soldier & psalms                //
/********************************************************/
router.get('/get-soldier-and-psalms', async (req, res) => {
    try {
        // log.info("Get action to get a soldier & psalms");
        let resData = {
            soldier: null,
            psalms: null
        }

        let indexOfPsalms = 0;
        let indexOfSoldier = 0;

        //get the index of the next soldier and the next psalms
        await models.indexsModel.find({}, (err, data) => {
            if (err) {
                console.log('err from find indexs');
                console.log(err)
            } else {
                indexOfPsalms = data[0].indexOfPsalms;
                indexOfSoldier = data[0].indexOfSoldiers;
            }
        });

        //get the soldier bi index
        await models.soldierModel.find({}, (err, data) => {
            if (err) {
                console.log('err from find soldiers');
                console.log(err)
            } else {
                resData.soldier = data[indexOfSoldier];
            }
        });

        //get the psalms by index
        await models.psalmsModel.find({}, (err, data) => {
            if (err) {
                console.log('err from find psalms');
                console.log(err)
            } else {
                resData.psalms = data[indexOfPsalms];
                res.send(resData);
            }
        });

    } catch (ex) {
        //log.error(ex.message);
        res.status(500).send(ex.message);
    }
});


/************************************************************/
//                update index after reading                //
/************************************************************/
router.put('/update-index-after-reading', async (req, res) => {
    try {
        //log.info("Get action to update index after reading");

        let soldierLength;
        let psalmsLength;

        let indexsData;
        let indexOfPsalms;
        let indexOfSoldiers;
        let amountOfCommemoration;
        let amountOfPsalmsBook;

        //get the soldier length
        await models.soldierModel.find({}, (err, data) => {
            if (err) {
                console.log('err from find soldiers');
                console.log(err)
            } else {
                soldierLength = data.length;
            }
        });

        //get the psalms length
        await models.psalmsModel.find({}, (err, data) => {
            if (err) {
                console.log('err from find psalms');
                console.log(err)
            } else {
                psalmsLength = data.length;
            }
        });


        //get the indexs
        await models.indexsModel.find({}, (err, data) => {
            if (err) {
                console.log('err from find indexs');
                console.log(err)
            } else {
                indexsData = data;
                indexOfSoldiers = data[0].indexOfSoldiers + 1;
                indexOfPsalms = data[0].indexOfPsalms + 1;
                amountOfCommemoration = data[0].amountOfCommemoration + 1;
                amountOfPsalmsBook = data[0].amountOfPsalmsBook;



                //                          update the indexs
                //check if the next index of sodiers is not biger then the length of solfiers array
                if (indexOfSoldiers == soldierLength)
                    indexOfSoldiers = 0;
                //check if the next index of psalms is not biger then the length of psalms array
                if (indexOfPsalms == psalmsLength) {
                    indexOfPsalms = 0;
                    amountOfPsalmsBook++;
                }


                //update the data in DB
                let dataToSend = {
                    indexOfSoldiers: indexOfSoldiers,
                    indexOfPsalms: indexOfPsalms,
                    amountOfCommemoration: amountOfCommemoration,
                    amountOfPsalmsBook: amountOfPsalmsBook,
                };
                let filter = {
                    indexOfSoldiers: indexsData[0].indexOfSoldiers,
                    indexOfPsalms: indexsData[0].indexOfPsalms,
                };


                models.indexsModel.updateOne(filter, dataToSend, (err, doc) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(doc);
                        res.send(true);
                    }
                });
            }
        });


    } catch (ex) {
        //log.error(ex.message);
        res.status(500).send(ex.message);
    }
});


module.exports = router;