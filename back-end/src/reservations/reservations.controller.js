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

module.exports = {
  list,
};
