const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/authy', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(function () {
    console.log("Connection connected Successfully");
}).catch(function () {
    console.log("Connection Fail");
})

//Schema
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        },
        match: /^("(?:[!#-\[\]-\u{10FFFF}]|\\[\t -\u{10FFFF}])*"|[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*)@([!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*|\[[!-Z\^-\u{10FFFF}]*\])$/u
    },
    password: {
        type: String,
        required: true

    },
    phone: {
        type: Number,
        required: true,
        unique:true
    },
    authyid: {
        type: String
    },
    isVerified: {
        type: Boolean
    }

});
//Model
const User = mongoose.model('User', UserSchema);
module.exports = User