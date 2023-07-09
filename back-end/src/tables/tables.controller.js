const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const connection = require("../db/connection");
/**
 * time validation handler for reservation
 */
async function validateTime(req, res, next) {
  try{
    const { reservation_date, reservation_time } = req.body;

    // const todaysDate = new Date();
    const date = new Date(`${reservation_date} ${reservation_time}`);
    const hour = date.getHours();
    const minutes = date.getMinutes();

    // if(todaysDate.toDateString() == date.toDateString() ){
    //   console.log("INSIDE OF TODAYS DATE---------------");
    //   return res.status(400).send({error: "Invalid time frame"})
    // }
    console.log("hour", hour);
    console.log("minutes",minutes)
    if(hour == 10){
      if(minutes < 30){
        return res.status(400).send({error: "Invalid time frame"})
      }
    }else if(hour == 21){
      if(minutes > 30){
        return res.status(400).send({error: "Invalid time frame"})
      }
    }else if(hour < 10 || hour >= 22){
      return res.status(400).send({error: "Invalid time frame"})
    }
    
    next();

  }catch(e){
    console.log("catched error at validateTime",e);
    return res.status(500).json({error: e})
  }

}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  try{
    const response = await connection('tables');
    
    return res.status(200).send({data: response})
  }catch(e){
    console.log(e);
    return res.status(500).send({error: e})
  }
}
/**
 * Insert handler for reservation resources
 */
async function insert(req, res, next) {
  try{
    const insertObj = {
      ...req.body
    }

    const response = await connection('tables').insert(insertObj);
    console.log("insert response",response)
    return res.status(200).send({
      data: 'Sucessfull'
    })

  }catch(e){
    console.log("catched error",e);
    return res.status(500).json({error: e})
  }

}

module.exports = {
  list: asyncErrorBoundary(list),
  insert: asyncErrorBoundary(insert)
};
