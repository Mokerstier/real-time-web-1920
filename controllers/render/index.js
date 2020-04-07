function serveHome(req, res) {
  res.render('pages/home.ejs', {
    title: 'Home',
    pagemsg: 'Welcome to the socket chat service'
  })
}

function serveChat(req, res) {
  res.render('pages/chat.ejs', {
    title: 'Chat',
    pagemsg: 'This is the beginning of your chat',
    user: req.query.fname
  })
}

module.exports = { serveHome, serveChat }