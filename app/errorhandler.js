
exports.PSQLerror = (err,req,res,next) => {
    if (err.code === "42703"){
        res.status(404).send({msg: "bad input - column doesn't exist"})
    } 
    else if (err.code === "23502"){
        res.status(400).send({msg: "missing one or more properties"})
    }
    else if (err.code === "23503"){
        res.status(400).send({msg: "invalid id"})
    }else  {
        next(err)
    }
}


exports.errorHandlerBadForm = (err,req,res,next) => {
    if (err.code === "22P02"){
        res.status(400).send({msg: "invalid input type"})
    } else {
        next(err)
    }
}

exports.TopicNotFoundError = (err,req,res,next) => {
    if (err.msg === "topic is not found"){
        console.log(err)
        res.status(404).send(err)
    } else {
        next(err)
    }
}

exports.userNotFoundError = (err,req,res,next) => {
    if (err.msg === "username not found"){
        res.status(404).send(err)
    } else {
        next(err)
    }
}

exports.invalidSortByQuery = (err,req,res,next) => {
    if (err.msg === "invalid sort_by query"){
        res.status(404).send(err)
    } else {
        next(err)
    }
}

exports.invalidOrderQuery = (err,req,res,next) => {
    if (err.msg === "invalid order type"){
        res.status(404).send(err)
    } else {
        next(err)
    }
} 

exports.errorhandlerinvalid = (err,req,res,next) => {
    if (err.msg === 'invalid id'){
        res.status(404).send(err)
    }
    else {
        res.status(500).send({msg: "generic error"})
    }
}
