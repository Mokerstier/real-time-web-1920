function storeUser(req){
  console.log(req.query.fname)
  const nickName = req.query.fname
  return nickName
}

module.exports = { storeUser }