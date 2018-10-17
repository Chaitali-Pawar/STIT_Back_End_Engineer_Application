const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

var userEventSchema = new Schema({
    email:  {
        type: String,
        required: true
    },
    category_name:  {
        type: String,
        required: true
    },
    genre_name: {
        type: String,
        required:true
    }
}, {
    timestamps: true
});

var UserEvent = mongoose.model('UserEvent',userEventSchema);
module.exports = UserEvent;
