const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static('public'));

require('./routes/htmlRoutes')(app);
require('./routes/apiRoutes')(app);

app.listen(PORT, function() {
    console.log('App listening on PORT' + PORT);
});
