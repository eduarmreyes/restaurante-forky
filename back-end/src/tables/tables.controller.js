const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const connection = require("../db/connection");

/**
 * params validation for reservation
 */
async function validateAssign(req, res, next) {
  try{
    const {table_id} = req.params;
    const {data} = req.body;

    const response = await connection('tables').where('table_id', table_id);
  
    if(response.length > 0){
      res.locals = response[0];

      if(res.locals.capacity < data.people){
        return res.status(400).send({error: 'Cannot assign a table with less capacity!'})
      }else if(res.locals.reservation){
        return res.status(400).send({error: 'The table was already being assigned. Please choose a different table'})
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
      ...req.body.data
    }
    //validation of live and tests requests
    if(insertObj.reservation_id){
      insertObj.reservation = insertObj.reservation_id;
      delete insertObj.reservation_id;
    }
    const response = await connection('tables').insert(insertObj).returning('table_id');
    return res.status(200).send({
      data: {table_id: response[0]}
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
    
      await connection('reservations')
      .update({status: 'seated'})
      .where('reservation_id', res.locals.data.reservation_id);
    
      await connection('tables')
        .update({reservation: res.locals.data.reservation_id})
        .where('table_id', res.locals.table_id);
      })

    // const response = await connection('reservations')
    //   .update({status: 'seated'})
    //   .where('reservation_id', res.locals.data.reservation_id);

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
    res.locals = {...res.locals, ...req.body};
    
    const response = await connection('tables')
      .where('table_id', res.locals.table_id);

    if(!response[0].reservation){
      return res.status(400).send({error: 'The table has not been assigned'})
    }
    next();
  }catch(e){
    console.log("catched error",e);
    return res.status(500).json({error: e})
  }

}

/**
 * Update handler to free a reservation from a table
 */
async function nullAssign(req, res, next) {
  try{
    const response = await connection('tables')
      .update({reservation: null})
      .where('table_id', res.locals.table_id);

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
  insert: asyncErrorBoundary(insert),
  assign: [validateAssign, asyncErrorBoundary(setSeatedStatus)],
  delete: [checkAssigned, asyncErrorBoundary(nullAssign)]
};
