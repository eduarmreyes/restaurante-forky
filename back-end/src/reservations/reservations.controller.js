const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const connection = require("../db/connection");
const { isValidDate, validHhMm } = require("../utils/date-time");
/**
 * time validation handler for reservation
 */
async function validateTime(req, res, next) {
  try{
    res.locals = {...res.locals, ...req.body.data};

    if(!res.locals){
      return res.status(400).send({error: "The request is missing required data"})
    }

    if(!res.locals.reservation_date || !res.locals.reservation_date === "" || !isValidDate(res.locals.reservation_date)){
      return res.status(400).send({error: "Invalid reservation_date"})
    }
    
    if(!res.locals.reservation_time || !res.locals.reservation_time === "" || !validHhMm(res.locals.reservation_time)){
      return res.status(400).send({error: "Invalid reservation_time"})
    }
    const { reservation_date, reservation_time } = res.locals;
    const date = new Date(`${reservation_date} ${reservation_time}`);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    
    /* Validate time frames of reservation */
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

    /* Validate future date */

    const receivedDate = new Date(res.locals.reservation_date);
    const todayDate = new Date();

    if(receivedDate < todayDate){
      return res.status(400).send({error: "Can only set up future reservations"})
    }
    //No Tuesdays validation
    if(receivedDate.getDay() === 1){
      return res.status(400).send({error: "Tuesdays are closed"})
    }
    
    next();

  }catch(e){
    console.log("catched error at validateTime",e);
    return res.status(500).json({error: e})
  }

}

/**
 * data validation handler for reservation
 */
function validateData(req, res, next) {
  try{
    
    if(!res.locals.first_name || res.locals.first_name === "" ){
        return res.status(400).send({error: "The request is missing first_name"})
    }
    if(!res.locals.last_name || res.locals.last_name === ""){
      return res.status(400).send({error: "The request is missing last_name"})
    }
    if(!res.locals.mobile_number || res.locals.mobile_number === ""){
      return res.status(400).send({error: "The request is missing mobile_number"})
    }

    if(!res.locals.people || res.locals.people === "" || Number.parseInt(res.locals.people) === 0 || typeof res.locals.people !== 'number'){
      return res.status(400).send({error: "The request is missing people"})
    }
    
    next();

  }catch(e){
    return res.status(500).json({error: e})
  }

}

/**
 * data validation handler for reservation
 */
function validateStatus(req, res, next) {
  try{
    
    if(res.locals.status === 'seated' ){
        return res.status(400).send({error: "Cannot create a reservation with seated status"})
    }
    if(res.locals.status === 'finished' ){
      return res.status(400).send({error: "Cannot create a reservation with finished status"})
    }
    next();
  }catch(e){
    return res.status(500).json({error: e})
  }

}

/**
 * List handler for reservation resources
 */
async function retrieveReservation(req, res) {
  try{
    const {reservation_id} = req.params;
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
    const params = req.query;
    let response;

    if(params.date){
      response = await connection('reservations')
        .where('reservation_date', params.date)
        .andWhereNot('status', 'finished')
        .orderBy('reservation_time');

    }else if(params.mobile_number){
      response = await connection("reservations")
        .whereRaw(
          "translate(mobile_number, '() -', '') like ?",
          `%${params.mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");

    }else{
      response = await connection('reservations')
        .whereNot('status', 'finished');
    }

    
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
    const response = await connection('reservations').insert(res.locals).returning('*');
    return res.status(201).send({
      data: {...response[0]}
    })

  }catch(e){
    console.log("catched error",e);
    return res.status(500).json({error: e})
  }

}
/**
 * validate function for reservation resource in db
 */
async function reservationExist(req, res, next) {
  try{
    res.locals = req.params;
    res.locals = {...res.locals, ...req.body.data}
    const reservation = await connection('reservations')
      .where('reservation_id', res.locals.reservation_id)

    if(reservation.length === 0){
      return res.status(404).json({error: "Reservation "+res.locals.reservation_id+" not found"})
    }

    next();

  }catch(e){
    console.log('cached error==============',e)
    return res.status(500).json({error: e})
  }

}
/**
 * Update handler for reservation resources
 */
async function updateReserv(req, res, next) {
  try{

    const reservation = await connection('reservations')
      .update(res.locals)
      .where('reservation_id', res.locals.reservation_id)
      .returning(['first_name', 'last_name', 'mobile_number', 'people']);

    return res.status(200).send({
      data: {...reservation[0]}
    })

  }catch(e){
    return res.status(500).json({error: e})
  }

}

/**
 * Update handler for reservation status
 */
async function updateStatus(req, res, next) {
  try{
    const { reservation_id} = req.params;
    delete res.locals.params;

    const response = await connection('reservations')
      .update(res.locals)
      .where('reservation_id', reservation_id);

    return res.status(200).send({
      data: { status: res.locals.status }
    })

  }catch(e){
    console.log("catched error",e);
    return res.status(500).json({error: e})
  }

}

/**
 * validation handler for reservation
 */
async function reservationFound(req, res, next) {
  try{
    res.locals = req.body.data;
    res.locals.params = req.params;

    const response = await connection('reservations')
      .where('reservation_id', res.locals.params.reservation_id);

    if(response.length === 0){
      return res.status(404).json({error: 'Reservation '+res.locals.params.reservation_id+' not found'})
    }

    if(response[0].status === 'finished'){
      return res.status(400).json({error: 'Cannot update a finished reservation'})
    }
   
    next();

  }catch(e){
    console.log("catched error",e);
    return res.status(500).json({error: e})
  }

}

/**
 * validation handler for uknown status
 */
async function unknownStatus(req, res, next) {
  try{
    
    if(!(res.locals.status === 'booked' || res.locals.status === 'seated' 
    || res.locals.status === 'finished' || res.locals.status === 'cancelled')){
      return res.status(400).json({error: 'unknown status'})
    }
    next();

  }catch(e){
    console.log("catched error",e);
    return res.status(500).json({error: e})
  }

}

module.exports = {
  list: asyncErrorBoundary(list),
  insert: [validateTime, validateData, validateStatus, asyncErrorBoundary(insert)],
  retrieveReservation: [reservationExist, asyncErrorBoundary(retrieveReservation)],
  update: [reservationExist,validateData, validateTime, asyncErrorBoundary(updateReserv)],
  updateStatus: [reservationFound, unknownStatus, asyncErrorBoundary(updateStatus)]
};
