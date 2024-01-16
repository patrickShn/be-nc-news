const docs = require('../../endpoints.json')


exports.getDocs = (req,res) => {
    return res.status(200).send(docs)
}