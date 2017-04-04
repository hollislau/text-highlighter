const express = require('express');
const app = express();

app.use(express.static(__dirname + '/build'));

app.listen(3000, () => process.stdout.write('Server up on port 3000\n'));
