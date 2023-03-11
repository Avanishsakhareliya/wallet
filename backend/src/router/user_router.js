const express = require("express");
const app = express();
let router = express.Router();
app.use(router);
let bodyParser = require('body-parser')
router.use(bodyParser.json({ limit: '500mb' }))

// controller
const {createNotes, listNotes, deleteNotes, editNotes}=require("../controller/WalletController")

// notes----------------
router.post('/create',createNotes)
router.get('/listnotes',listNotes)
router.delete('/delete/:id',deleteNotes)
router.put('/edit/:id',editNotes)

module.exports = router;
