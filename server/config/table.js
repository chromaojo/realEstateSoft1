const express = require('express');
const route = express.Router();
const path = require("path");
const db = require('../config/db');



// To create Table for user and Account 
route.get('/createUser', (req, res) => {


    const sqlUsers = `
        CREATE TABLE IF NOT EXISTS realestate.re_users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id VARCHAR(255) UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'staff', 'client') DEFAULT 'client'
        );
        `;

    const sqlAccounts = `
        CREATE TABLE IF NOT EXISTS realestate.re_accounts (
        account_id VARCHAR(255) UNIQUE PRIMARY KEY,
        account_balance INT DEFAULT 0,
        total_spent INT DEFAULT 0,
        phone_number VARCHAR(255),
        whatsapp VARCHAR(255),
        instagram VARCHAR(255),
        facebook VARCHAR(255),
        linkedin VARCHAR(255),
        about TEXT,
        role ENUM('admin', 'staff', 'agent', 'client') DEFAULT 'client'
        profilePix VARCHAR(255),
        surname VARCHAR(255),
        othername VARCHAR(255),
        username VARCHAR(255) UNIQUE,
        address VARCHAR(255),
        email VARCHAR(255) NOT NULL UNIQUE,
        user_id VARCHAR(255) UNIQUE,
        FOREIGN KEY (user_id) REFERENCES re_users(user_id)
        );
        `;
    db.query(sqlUsers, (errRoles) => {
        if (errRoles) {
            console.log('Error creating roles table:', errRoles);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Users Created Successfully');

        db.query(sqlAccounts, (errAccounts) => {
            if (errAccounts) {
                console.log('Error creating accounts table:', errAccounts);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Accounts Created Successfully');


        });
        db.query(sqlSaved, (errSh) => {
            if (errSh) {
                console.log('Error creating property table:', errShipments);
                return res.status(500).send('Internal Server Error');
            }
            console.log(' Archive / Saved Table Created Successfully');

            res.send(' Archive / Saved Tables Created Successfully');
        });
    });
});

route.get('/createProp', (req, res) => {

    const sqlProp = `
        CREATE TABLE IF NOT EXISTS realEstate.re_property (
        id INT PRIMARY KEY AUTO_INCREMENT,
        prop_id INT UNIQUE,
        title VARCHAR(255) NOT NULL,
        picture VARCHAR(155),
        description TEXT,
        action ENUM('sale', 'lease', 'rent') NOT NULL,
        prop_type ENUM('land', 'building','shortlet','ware_house', 'apartment') NOT NULL,
        category ENUM('residential', 'commercial') NOT NULL,
        prop_status ENUM('active', 'rented', 'sold','leased') DEFAULT 'active',
        price DECIMAL(10, 2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        `;

    const sqlSaved = `
        CREATE TABLE IF NOT EXISTS realEstate.re_saved (
        id INT UNIQUE PRIMARY KEY AUTO_INCREMENT,
        prop_id INT UNIQUE,
        title VARCHAR(255) NOT NULL,
        price VARCHAR(255) ,
        location VARCHAR(255),
        pro_link VARCHAR(65) NOT NULL,
        date VARCHAR(65),
        user_id VARCHAR(255), 
        picture VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES re_users(user_id)
        );
        `;

    db.query(sqlProp, (errRoles) => {
        if (errRoles) {
            console.log('Error creating roles table:', errRoles);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Property Created Successfully');
    });

    db.query(sqlSaved, (errAccounts) => {
        if (errAccounts) {
            console.log('Error creating accounts table:', errAccounts);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Saved Table Created Successfully');
    });
    res.send('Saved & Property Table Created Successfully');
});

route.get('/createReport', (req, res) => {

    const sqlReport = `
    CREATE TABLE IF NOT EXISTS realEstate.re__report (
      id INT AUTO_INCREMENT PRIMARY KEY,
      report_id VARCHAR(255) UNIQUE,
      title VARCHAR(255) NOT NULL,
      progress ENUM('pending', 'finished') DEFAULT 'pending',
      name VARCHAR(255) NOT NULL,
      user_id VARCHAR(255),
      date VARCHAR(255),
      time VARCHAR(255)
    );
  `;

    const sqlReportC = `
    CREATE TABLE IF NOT EXISTS realEstate.re__content (
      id INT PRIMARY KEY AUTO_INCREMENT,
      activity TEXT,
      result TEXT,
      recommendation TEXT,
      status ENUM('completed', 'in progress', 'not started', 'onhold'),
      progress ENUM('pending', 'finished') DEFAULT 'pending',
      report_id VARCHAR(255) NOT NULL,
      FOREIGN KEY (report_id) REFERENCES realEstate.re__report(report_id)
    );
  `;

    db.query(sqlReport, (errRoles) => {
        if (errRoles) {
            console.log('Error creating roles table:', errRoles);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Users Created Successfully');

    });
    db.query(sqlReportC, (errAccounts) => {
        if (errAccounts) {
            console.log('Error creating accounts table:', errAccounts);
            return res.status(500).send('Internal Server Error');
        }
        // console.log('Saved Table Created Successfully');

    });
    res.send('Report Table Created Successfully');
});

route.get('/createComplain', (req, res) => {


    const sqlComplaint = `
    CREATE TABLE IF NOT EXISTS realEstate.re_complaint (
      id INT AUTO_INCREMENT PRIMARY KEY,
      report_id VARCHAR(255) UNIQUE,
      name VARCHAR(255) NOT NULL,
      aacount_id VARCHAR(255) NOT NULL,
      number VARCHAR(255),
      title VARCHAR(255),
      complain TEXT,
      status ENUM('pending', 'solve') DEFAULT 'pending',
      user_id VARCHAR(255) NOT NULL,
      date VARCHAR(255),
      time VARCHAR(255)
    );
  `;





    db.query(sqlComplaint, (errRoles) => {
        if (errRoles) {
            console.log('Error creating roles table:', errRoles);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Users Created Successfully');

    });

    res.send('Complaint Table Created Successfully');
});

route.get('/createInvestment', (req, res) => {

    const sqlInvest = `
    CREATE TABLE IF NOT EXISTS realEstate.re_investment (
      id INT AUTO_INCREMENT PRIMARY KEY,
      invest_id VARCHAR(255) UNIQUE,
      title VARCHAR(255) NOT NULL,
      details TEXT,
      price DECIMAL(10, 2) NOT NULL,
      picture VARCHAR(255) NOT NULL,
      status ENUM('ongoing', 'expired') DEFAULT 'ongoing',
      date VARCHAR(255),
      name VARCHAR(255)
    );
  `;
    const sqlTransaction = `
    CREATE TABLE IF NOT EXISTS realEstate.re_transaction (
        transaction_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255),
        payment_method VARCHAR(255),
        transaction_date DATETIME,
        amount DECIMAL(12, 2),
        currency VARCHAR(10),
        transaction_type ENUM('debit', 'credit'),
        status ENUM('pending', 'completed', 'failed'),
        description VARCHAR(255),
        reference_number VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES re_users(user_id)
    );
  `;

    db.query(sqlInvest, (errRoles) => {
        if (errRoles) {
            console.log('Error creating roles table:', errRoles);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Investment Created Successfully');

    });
    db.query(sqlTransaction, (errRoles) => {
        if (errRoles) {
            console.log('Error creating roles table:', errRoles);
            return res.status(500).send('Internal Server Error');
        }
        console.log(' Transaction Created Successfully');

    });

    res.send('Investment Transaction Table Created Successfully');
});

route.get('/createLead', (req, res) => {

    const sqlLead = `
    CREATE TABLE IF NOT EXISTS realEstate.re_lead (
        lead_id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(20),
        gender VARCHAR(20),
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone_number VARCHAR(20),
        company_name VARCHAR(100),
        job_title VARCHAR(100),
        industry VARCHAR(100),
        user_id VARCHAR(100),
        lead_by VARCHAR(200),
        info TEXT,
        location VARCHAR(100),
        product_service_interest VARCHAR(200),
        recommendation TEXT,
        status ENUM('new', 'follow-up', 'converted') DEFAULT 'new',
        follow_comment TEXT,
        assigned_to VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  
    const sqlInspect = `
    CREATE TABLE IF NOT EXISTS realEstate.re_inspection (
      id INT AUTO_INCREMENT PRIMARY KEY,
      transaction_id VARCHAR(255) UNIQUE,
      name VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      details TEXT,
      method VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      balance DECIMAL(10, 2) NOT NULL, 
      date VARCHAR(255),
      time VARCHAR(255)
    );
  `;

    db.query(sqlLead, (errRoles) => {
        if (errRoles) {
            console.log('Error creating roles table:', errRoles);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Lead Created Successfully');

    });
    // db.query(sqlInspect, (errRoles) => {
    //     if (errRoles) {
    //         console.log('Error creating roles table:', errRoles);
    //         return res.status(500).send('Internal Server Error');
    //     }
    //     console.log(' Transaction Created Successfully');

    // });

    res.send('Lead Table Created Successfully');
});



module.exports = route;