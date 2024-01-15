

exports.errorHandler = (err,req,res,next) => {
    //checking for bad requests or invalid ids etc. 
    if (err.code === "23502" || err.code === "22P02"){
         return res.status(400).send({msg:"Bad request"})
    }
    else{
        return res.status(500).send({msg: "generic bad error"})
    }
};