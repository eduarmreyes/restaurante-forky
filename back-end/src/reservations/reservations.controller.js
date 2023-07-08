const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const connection = require("../db/connection");
/**
 * List handler for reservation resources
 */
async function list(req, res) {
  try{
    console.log('request received');
  }catch(e){
    console.log(e);
  }
  res.json({
    data: [],
  });
}
/**
 * Insert handler for reservation resources
 */
async function insert(req, res, next) {
  try{
    const insertObj = {
      ...req.body
    }

    const response = await connection('reservations').insert(insertObj);

    return res.status(200).send({
      data: 'Sucessfull'
    })

  }catch(e){
    console.log("catched error",e);
    return res.status(500).json({error: e})
  }

}

module.exports = {
  list,
  insert: asyncErrorBoundary(insert)
};
