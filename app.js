const express = require('express');
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
const User = require('./model/user');
app.use(bodyParser.urlencoded({
    extended: true
}))
const port = 3000;
const authy = require('authy')('Api_key');

app.post('/signup', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const countryCode = req.body.countryCode

    try {
        let userfind = await User.findOne({
            email: email
        })
        if (userfind) {
            return res.send('user Exist! Please Login ')
        } else {
            authy.register_user(email, phone, countryCode, function (err, regRes) {
                if (err) {
                    res.send(err)
                } else {
                    User.authyid = regRes.user.id;
                    authy.request_sms(User.authyid, function (smsErr, smsRes) {
                        if (smsErr) {
                            res.json({
                                msg: 'There is something wrong to send Otp',
                                err: err
                            });
                        } else if (smsRes) {
                            console.log(smsRes);
                            res.json({
                                msg: 'OTP Sent to the cell phone.',
                                result: smsRes
                            });
                        }
                    });
                }
    
            });
            let users = new User({
                email: email,
                password: password,
                countryCode: countryCode,
                phone: phone,
                isVerified: false
            });
            await users.save();  
        }

    } catch (err) {
        res.json({
            err: err
        })

    }
});

app.post('/verify', async (req, res) => {
    try {
        let token = req.body.token;
        authy.verify(User.authyid, token, function (verifyErr, verifyRes) {
            if (verifyErr) {
                console.log(verifyErr);
                res.json({msg:'OTP verification failed.'});
            } else if (verifyRes) {
                console.log(verifyRes);
                res.status(200).json({msg:'OTP Verified.'});
            }
        })

        let usersVerifed = new User({isVerified:true});
        usersVerifed.save();

    }
     catch (err) {
        res.send(err);
    }
})

app.listen(port, () => {
    console.log(`${port} is listening`)
});