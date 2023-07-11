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

/**
 * Update handler to assign a reservation to a table
 */
async function assign(req, res, next) {
  try{
    // const {table_id} = req.params;
    // const {data} = req.body;
    // console.log('reveived', data);
    // console.log('table_id', table_id);
    // const response = await connection('tables')
    //   .update({reservation: data})
    //   .where('table_id', table_id);
    // console.log("insert response",response)
    console.log('locals------------', res.locals)
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
  assign: [validateAssign, asyncErrorBoundary(assign)]
};
