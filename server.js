
const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

app.listen(PORT, function() {
  console.log("App running on port 3000!");
});
