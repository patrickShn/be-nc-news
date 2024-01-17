
exports.psqlerror = (err,req,res,next) => {
    if (err.code === "42703"){
        res.status(400).send({msg: "bad request"})
    } 
    else if (err.code === "23502"){
        res.status(400).send({msg: "missing one or more properties"})
    }else {
        next(err)
    }
}


exports.errorHandlerBadForm = (err,req,res,next) => {
    if (err.code === "22P02"){
        res.status(400).send({msg: "bad request"})
    } else {
        next(err)
    }
}

exports.errorhandlerinvalid = (err,req,res,next) => {
    if (err.length === 0 || err.code === "22003"){
        res.status(404).send({msg: "invalid id"})
    } 
    if (err.msg === 'invalid id'){
        res.status(400).send(err)
    }
    else {
        res.status(500).send({msg: "generic error"})
    }
}
