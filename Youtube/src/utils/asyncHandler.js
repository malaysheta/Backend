const asyncHandler = (fn) => async(req,res,next) =>{
    try{
        await fn(req,res,next)
    }
    catch (err){
        console.log("Error :",err);
        res.send(err.code || 500);

        
    }
} 

export {asyncHandler}