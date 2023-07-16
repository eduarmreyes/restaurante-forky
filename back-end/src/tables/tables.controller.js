const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const connection = require("../db/connection");

/**
 * params validation for reservation
 */
async function validateAssign(req, res, next) {
  try{
    const {table_id} = req.params;
    const {data} = req.body;

    if(!data){
      return res.status(400).send({error: 'data is required'})
    }

    if(!data.reservation_id){
      return res.status(400).send({error: 'reservation_id is required'})
    }
    const reservation = await connection('reservations').where('reservation_id', data.reservation_id);

    if(reservation.length === 0){
      return res.status(404).send({error: 'reservation '+ data.reservation_id +' not found'})
    }
    if(reservation[0].status === "seated"){
      return res.status(400).send({error: 'The status is already seated'})
    }

    const response = await connection('tables').where('table_id', table_id);
    
    if(response.length > 0){
      res.locals = response[0];
      
      if(Number.parseInt(res.locals.capacity) < Number.parseInt(reservation[0].people)){
        return res.status(400).send({error: 'Cannot assign a table with less capacity'})
      }else if(res.locals.reservation){
        return res.status(400).send({error: 'The table is already occupied'})
      }else{
        res.locals = { ...res.locals, data: {...data}};
        next();
      }
      
    }else{
      return res.status(400).send({error: 'Table was not found!'})
    }
    
  }catch(e){
    console.log("catched error at validateTime",e);
    return res.status(500).json({error: e})
  }

}

/**
 * data validation handler for reservation
 */
async function validateData(req, res, next) {
  try{
    res.locals = req.body.data;

    if(!res.locals){
      return res.status(400).send({error: "No data was received"})
    }

    if(!res.locals.table_name || res.locals.table_name === "" || res.locals.table_name.length <= 1 ){
        return res.status(400).send({error: "table_name is missing requirements"})
    }
    if(!res.locals.capacity || res.locals.capacity === "" || Number.parseInt(res.locals.capacity) === 0 || typeof res.locals.capacity !== 'number'){
      return res.status(400).send({error: "capacity is missing requirements"})
    }

    
    next();

  }catch(e){
    return res.status(500).json({error: e})
  }

}
/**
 * List handler for tables resources
 */
async function list(req, res) {
  try{
    const response = await connection('tables').orderBy('table_name');
    
    return res.status(200).send({data: response})
  }catch(e){
    console.log(e);
    return res.status(500).send({error: e})
  }
}
/**
 * Insert handler for tables resources
 */
async function insert(req, res, next) {
  try{

    if(res.locals.reservation_id){
      res.locals.reservation = res.locals.reservation_id;
      delete res.locals.reservation_id;
    }
    const response = await connection('tables').insert(res.locals).returning('*');
    return res.status(201).send({
      data: {...response[0]}
    })

  }catch(e){
    console.log("catched error",e);
    return res.status(500).json({error: e})
  }

}

/**
 * Update handler to assign a reservation to a table
 */
async function setSeatedStatus(req, res, next) {
  try{

    await connection.transaction(async trx => {
    
      await trx('reservations')
        .update({status: 'seated'})
        .where('reservation_id', res.locals.data.reservation_id);
    
      await trx('tables')
        .update({reservation: res.locals.data.reservation_id})
        .where('table_id', res.locals.table_id);
      });

    return res.status(200).send({
      data: 'Sucessfull'
    })

  }catch(e){
    console.log("catched error",e);
    return res.status(500).json({error: e})
  }

}

/**
 * Update handler to check if a reservation is found from a tables
 */
async function checkAssigned(req, res, next) {
  try{
    res.locals = req.params;
    res.locals = {...res.locals, ...req.body.data};

    const response = await connection('tables')
      .where('table_id', res.locals.table_id);

    if(response.length === 0){
      return res.status(404).send({error: 'The table '+res.locals.table_id+' was not found'})
    }

    if(!response[0].reservation){
      return res.status(400).send({error: 'The table is not occupied'})
    }

    res.locals.reservation_id = response[0].reservation;
    next();
  }catch(e){
    console.log("catched error <><>",e);
    return res.status(500).json({error: e})
  }

}

/**
 * Update handler to free a reservation from a table
 */
async function nullAssign(req, res, next) {
  try{

    await connection.transaction(async tran =>{
      await tran('tables')
        .update({reservation: null})
        .where('table_id', res.locals.table_id);

      await tran('reservations')
        .update({status: 'finished'})
        .where('reservation_id', res.locals.reservation_id);
    })

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
  insert: [validateData, asyncErrorBoundary(insert)],
  assign: [validateAssign, asyncErrorBoundary(setSeatedStatus)],
  delete: [checkAssigned, asyncErrorBoundary(nullAssign)]
};
