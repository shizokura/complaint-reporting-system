const MONGOOSE  = require('../config/mongo');
const MODEL     = require('./model');
const Schema    = MONGOOSE.Schema;

const schema    = new Schema
({
    first_name : { type: String, trim: true, default : '', required: true },
    middle_name : { type: String, trim: true, default : '' },
    last_name : { type: String, trim: true, default : '', required: true  },
    full_name: { type: String, trim: true, required: true },
    email : { type: String, lowercase : true, trim: true, default : '', required: true, index: true, unique: true  },
    password : { type: String, required: true },
    keywords : { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, required: true, trim: true, enum: [ 'Admin', 'Member' ] },
    is_verified: { type: Boolean, required: true }
},
{
    timestamps : { createdAt   : 'created_at', updatedAt   : 'updated_at' }
});

schema.index({ keywords: 'text' });

module.exports = class db_user extends MODEL
{
    constructor ()
    {
        super('users', schema);
    }
}