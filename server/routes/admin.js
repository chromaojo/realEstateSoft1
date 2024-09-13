const express = require('express');
const route = express.Router();
const mail = require('../config/mail');
const path = require("path");
const db = require('../config/db');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const { UserLoggin } = require('../auth/auth');
const {eachUser, editUser, allUser }=require('../module/user')
const { allMyAdLead, oneLead, createLead } = require('../module/lead');
const { allAdProp, oneAdProp, createProp, deleteProp } = require('../module/property');
const { allComplain, createComplain } = require('../module/complaint');
const { allMyRept, allRept, oneRept, deleteRept } = require('../module/report');
const { allAdSaved, createSaved, deleteSaved } = require('../module/saved');
const { allAdInvest, oneInvest, createInvest } = require('../module/investment');
let random = Math.floor(Math.random() * 99999999 / 13.9);
let rando = Math.floor(Math.random() * 99999);
const rand = rando + "rEs" + random;
const cookieParser = require('cookie-parser');
const session = require('express-session');




route.use(
    session({
        secret: `Hidden_Key`,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    })
);


route.use(express.json())
route.use(express.urlencoded({ extended: true }));








// Register new user 
route.post('/register', (req, res) => {
    const { email, password, password1, surname, othername, username, address, phone_number } = req.body;

    db.query('SELECT email FROM realEstate.re_users WHERE email = ?', [email], async (error, result) => {
        if (error) { console.log("Customized Error ", error); }
        if (result.length > 0) {
            return res.status(401).json({
                message: 'Email Already Taken'
            })
        } else if (password == password1) {
            const user_id = 'rE' + random + 'sT'
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query('INSERT INTO realEstate.re_users SET ?', { email: email, password: hashedPassword, user_id }, (error, result) => {
                if (error) {
                    console.log('A Registeration Error Occured ', error);
                } else {

                    // const messages = {
                    //     from: {
                    //         name: 'Property Biz Software',
                    //         address: 'felixtemidayoojo@gmail.com',
                    //     },
                    //     to: email,
                    //     subject: "Welcome To Property Biz App",
                    //     text: `<b> Dear New User, Welcome to Property Biz INT'L,</b> \n \n  Your Real Est Account has been opened successfully . \n Ensure that Your Password is kept safe. Incase of any compromise, ensure you change or optimizee the security on your application.`,
                    // } 
                    // mail.sendIt(messages)

                    // To create the account table into the user 
                    db.query('SELECT * FROM realEstate.re_users WHERE email = ?', [email], async (error, result) => {
                        if (error) {

                            return res.status(500).json({
                                message: 'Internal Server Error'
                            });
                        } else {
                            db.query('INSERT INTO realEstate.re_accounts SET ?', { user_id: result[0].user_id, email: email, account_id: rand, account_balance: 0, surname: surname, othername: othername, username: username, address: address, phone_number: phone_number });
                        }
                    });


                    return res.redirect('/login');
                }

            });


        } else {
            return res.redirect('/register');
        }

    })

});

// The Users Section


// To get all users 
route.get('/users', allUser, (req, res) => {

});

// To get each user detail 
route.get('/uzer/:user_id', eachUser, (req, res) => {

});



// To edit each users role for the admin
route.post('/:user_id/edit', UserLoggin, (req, res) => {
    const userId = req.params.user_id;
    const newRole = req.body.role; // Assuming the role is sent in the request body

    // Update user role in the database
    const sql = `
      UPDATE realEstate.re_users
      SET role = ?
      WHERE user_id = ?;
    `;

    db.query(sql, [newRole, userId], (err, results) => {
        if (err) {
            console.log('Error updating user role:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.clearCookie('userOne');
        res.redirect('/admin/users'); // Redirect to the list of users or any appropriate route
    });
});


// Dashboard route
route.get('/dashboard', async(req, res) => {
    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const lan = 'land';
    const build = 'building';
    const short = 'shortlet';

    const property = await new Promise((resolve, reject) => {
        const sqls = `SELECT * FROM realEstate.re_property ORDER BY id DESC`;
        db.query(sqls, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
    const land = await new Promise((resolve, reject) => {
        const sqls = `SELECT * FROM realEstate.re_property WHERE prop_type = ?`;
        db.query(sqls,[lan], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
    const building = await new Promise((resolve, reject) => {
        const sqls = `SELECT * FROM realEstate.re_property WHERE prop_type = ?`;
        db.query(sqls,[build], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
    const shortlet = await new Promise((resolve, reject) => {
        const sqls = `SELECT * FROM realEstate.re_property WHERE prop_type = ?`;
        db.query(sqls,[short], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
    const investment = await new Promise((resolve, reject) => {
        const sqls = `SELECT * FROM realEstate.re_investment ORDER BY id DESC`;
        db.query(sqls, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
    const complain = await new Promise((resolve, reject) => {
        const sqls = `SELECT * FROM realEstate.re_complaint ORDER BY id DESC`;
        db.query(sqls, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
    
    res.render('dashboard',{userData, property, building, shortlet, land, investment, complain})
});
// See All Properties 

route.get('/props', allAdProp, (req, res) => {

});

route.get('/del-prop/:id', deleteProp, (req, res) => {

});



// To Read One Property detail 
route.get('/property-zZkKqQP/:id', oneAdProp, (req, res) => {


});


// To gat Create Property
route.get('/create/prop', (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    res.render('prop-create', { userData })
});

// To gat Create Property
route.post('/create/pXrRoPp', createProp, (req, res) => {


});

// To gat Create Property
route.get('/transactions', (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const userId = userCookie.user_id
    const sql = `
    SELECT * FROM realestate.re_transaction WHERE user_id = ? ORDER BY transaction_id DESC;
  `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log('Login Issues :', err);
            return res.status(500).send('Internal Server Error');
        }


        if (results) {

            const userTran = results

            const userData = userCookie
            return res.render('transaction', { userData, userTran })

        }

    })

});



// To Read All Investments 
route.get('/investments', allAdInvest, (req, res) => {

});

// To Read One Investment detail 
route.get('/invest/:id', oneInvest, (req, res) => {

    res.send('Route is okay')
});

// To To Get CReate Investment page
route.get('/investe', UserLoggin, (req, res) => {
    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;


    res.render('invest-create', { userData })
});

// To Post Investment 
route.post('/xXpPLliLZz', createInvest, (req, res) => {


});


// User profile section
route.get('/profile', UserLoggin, (req, res) => {
    const userData = req.app.get('userData');
    const userCookie = userData
    console.log('Here is my Dashboard Data', userCookie);
    if (!userCookie) {
        res.redirect('/login');
    } else {
        const user = db.query('SELECT * FROM realEstate.re_users WHERE email = ?', [userData.email], async (error, result) => {

            // console.log('This is the dashboard Details : ', userData);
            if (error) {
                console.log(" Login Error :", error);
                return res.redirect('/admin/logout');
            }
            if (result) {
                res.render('profile', { userData, });
            }

        })
    }
});


// To create Saved Properties
route.get('/save/:id', createSaved, (req, res) => {

    res.redirect('/admin/saved')
});


// To Get all the saved Property details
route.get('/delet/:id', deleteSaved, (req, res) => {

    res.redirect('/admin/saved')
});


// Report Section 

// To Get all my Report details
route.get('/my-report', allMyRept, (req, res) => {

});

// To Get one Report details
route.get('/reeport/:report_id', oneRept, (req, res) => {

});

// To delete a Report details
route.get('/delRep/:report_id', deleteRept, (req, res) => {
    res.redirect('/admin/my-report')
});


// To Get all Report list
route.get('/all-report', allRept, (req, res) => {

});

// To Get all my saved Property details
route.get('/saved', allAdSaved, (req, res) => {


});

// To get the editing Page  
route.use('/edit', require('../routes/edit'));


// To Get all my Complain details
route.get('/complaints', allComplain, (req, res) => {
});

// To post all my Complain details
route.post('/complaints/xXPpRyds', createComplain, (req, res) => {


});


// To Get all my lead details
route.get('/mYlead/wWwCcYtT', allMyAdLead, (req, res) => {


});

route.get('/vVxYLead/:id', oneLead, (req, res) => {


});


// To Get all my Lead details
route.post('/lead/KxkRTtyZx', createLead, (req, res) => {
    res.redirect('/admin/mYlead/wWwCcYtT');


});



// Logout route
route.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        delete userData
        res.clearCookie('user');
        if (err) {
            console.error(err);
            res.status(500).send('Error logging out');
        } else {
            res.redirect('/login');
        }
    });
});




module.exports = route;
