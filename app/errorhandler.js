
exports.errorHandlerBadForm = (err,req,res,next) => {
    if (err.code === "22P02"){
        res.status(400).send({msg: "Bad Request"})
    } else {
        next(err)
    }
}

exports.errorhandlerinvalid = (err,req,res,next) => {
    console.log(err)
    if (err.msg === "invalid id"){
        res.status(404).send({msg: "invalid id"})
    } else {
        res.status(500).send({msg: "generic error"})
    }
}
