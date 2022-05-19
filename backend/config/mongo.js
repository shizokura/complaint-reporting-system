
const MONGOOSE = require('mongoose');
const CONFIG = require('../config');

MONGOOSE.connect(CONFIG.MONGO_DB_CONNECTION_STRING,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}, async function(error)
{
    if (error)
    {
        console.log("ERROR", error);
        console.log('access denied');
    }
});

// MONGOOSE.set('useCreateIndex', true);
MONGOOSE.pluralize(null);

module.exports = MONGOOSE;