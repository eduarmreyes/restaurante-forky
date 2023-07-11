const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const connection = require("../db/connection");
/**
 * time validation handler for reservation
 */
async function validateTime(req, res, next) {
  try{
    const { reservation_date, reservation_time } = req.body;
    const date = new Date(`${reservation_date} ${reservation_time}`);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    
    
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
async function getReservation(req, res) {
  try{
    const {reservation_id} = req.body;
    const response = await connection('reservations').where('reservation_id',reservation_id);
    
    return res.status(200).send({data: response[0]})
  }catch(e){
    console.log(e);
    return res.status(500).send({error: e})
  }
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  try{
    const {date} = req.params;
    console.log('request received', date);
    const response = await connection('reservations');
    
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
    /*
    Validation between live and test requests
    */
   let insertObj;

   if(req.body.data){
    insertObj = {...req.body.data};
   }else{
    insertObj = {...req.body}
   }
    

    const response = await connection('reservations').insert(insertObj).returning('reservation_id');
    return res.status(200).send({
      data: {reservation_id: response[0]}
    })

  }catch(e){
    console.log("catched error",e);
    return res.status(500).json({error: e})
  }

}

module.exports = {
  list,
  insert: [validateTime, asyncErrorBoundary(insert)],
  getReservation
};
