const Walletmodel = require("../modal/wallet")

module.exports.createNotes = async (req, res) => {
    try {
        const { startDate, description, amount, selectOption, summary } = req.body;
        let userData = await Walletmodel.create({
            startDate: startDate,
            description: description,
            selectOption: selectOption,
            amount: amount,
            summary: summary,
        })
        res.send({ findUser: userData, message: "added successfully" })

    } catch (error) {
        console.log(error)
    }

}

module.exports.listNotes = async (req, res) => {
    try {
        const data = await Walletmodel.find({})
        res.send({ data, message: "getted user walltes" })

    } catch (error) {
        console.log(error)
    }
}

module.exports.deleteNotes = async (req, res) => {
    try {
        const data = await Walletmodel.findByIdAndRemove(req.params.id)
        res.send({ data, message: "delete notes" })

    } catch (error) {
        console.log(error)
    }
}
module.exports.editNotes = async (req, res) => {
    try {
        const data = await Walletmodel.findByIdAndUpdate(req.params.id, req.body)
        res.send({ data, message: "edit successfully" })
    } catch (error) {
        console.log(error)
    }
}