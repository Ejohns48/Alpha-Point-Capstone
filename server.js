var fs = require("fs");
var path = require("path");
var express = require("express");
var bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
var app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { REACT_APP_DB_HOST, REACT_APP_DB_USER, REACT_APP_DB_PWD, REACT_APP_DB_NAME, PORT } = process.env;
const jwtKey = 'my_secret_key';
const jwtExpirySeconds = 3000;

var mysql = require("mysql2");

const con = mysql.createConnection({
    host: REACT_APP_DB_HOST,
    user: REACT_APP_DB_USER,
    password: REACT_APP_DB_PWD,
    database: REACT_APP_DB_NAME,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!!");
});

app.set("port", PORT);

app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get('/getloggedout/', function (req, res) {
    res.cookie('token', 2, { maxAge: 0 })
    res.send({ redirect: '/employees'});
});
app.get('/getloggedoutpat/', function (req, res) {
    res.cookie('token', 2, { maxAge: 0 })
    res.send({ redirect: 'patients.html'});
});
app.get('/getloggedin/', function (req, res) {

    var viewpage = 0;
    var datahold = [];
    const validtoken = req.cookies.token;
    var payload;
    
    if(!validtoken) {
        viewpage = 0;
        console.log("NVT");
    } else {
        try {
            payload = jwt.verify(validtoken, jwtKey);
            viewpage = payload.empkey;

            var sqlsel = 'select * from employeeInfo where empid = ?';
            
            var inserts = [viewpage];

            var sql = mysql.format(sqlsel, inserts);
            
            con.query(sql, function (err, data) {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                datahold = data;
                res.send(JSON.stringify(data));
                
            });

          } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                viewpage = 0;
                console.log("NVT2");
            }
                viewpage = 0;
                console.log("NVT3");    
          }
        }
});
app.get('/getloggedinpatient/', function (req, res) {

    var viewpage = 0;
    const validtoken = req.cookies.token;
    var payload;
    
    if(!validtoken) {
        viewpage = 0;
        console.log("NVT");
    } else {
        try {
            payload = jwt.verify(validtoken, jwtKey);
            viewpage = payload.patkey;

            var sqlsel = 'select * from patientInfo where patientid = ?';
            
            var inserts = [viewpage];

            var sql = mysql.format(sqlsel, inserts);
            
        
            con.query(sql, function (err, data) {
                
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                res.send(JSON.stringify(data));
                
            });

          } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                viewpage = 0;
                console.log("NVT2");
            }
                viewpage = 0;
                console.log("NVT3");    
          }
        }
});

  app.post('/insertpatient', function (req, res) {
    var pfname = req.body.patientfirstname;
    var plname = req.body.patientlastname;
    var pdob = req.body.patientdob;
    var pemail = req.body.patientemail;
    var pphone = req.body.patientphone;
    var paddress = req.body.patientaddress;
    var pcity = req.body.patientcity;
    var pstate = req.body.patientstate;
    var pzip = req.body.patientzip;
    var pins = req.body.patientinsurance;
    var ppwd = req.body.patientpwd;
  
    var saltRounds = 10;
    var theHashedPW = '';
  
    bcrypt.hash(ppwd, saltRounds, function (err, hashedPassword) {
  
        if (err) {
            ("Bad on encrypt");
            return;
        } else {
            
            theHashedPW = hashedPassword;
  
            var sqlins = "INSERT INTO patientInfo (patientfirstname, patientlastname, patientdob, patientemail, patientphone, patientaddress, patientcity, patientstate, patientzip, patientinsurance, patientpwd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
            var inserts = [pfname, plname, pdob, pemail, pphone, paddress, pcity, pstate, pzip, pins, theHashedPW];
  
            var sql = mysql.format(sqlins, inserts);
  
            con.execute(sql, function (err, result) {
                if (err) throw err;
                ("1 record inserted");
                res.redirect('./searchpatients.html');
                res.end();
              });
            }
        });
    });

app.post('/loginpatient/', function (req, res) {
  var pemail = req.body.patientemail;
  var ppwd = req.body.patientpwd;

  var sqlsel = 'select * from patientInfo where patientemail = ?';

  var inserts = [pemail];

  var sql = mysql.format(sqlsel, inserts);
  con.query(sql, function (err, data)     {
      //Checks to see if there is data in the result
      if (data.length > 0) {
        console.log("User name correct: ");
          var patkey = data[0].patientid;
          bcrypt.compare(ppwd, data[0].patientpwd, function (err, passwordCorrect ) {
              if (err) {
                  throw err;
              } else if (!passwordCorrect) {
                console.log("Password Incorrect");
              } else {
                console.log("Password Correct");
                  const token = jwt.sign({ patkey }, jwtKey, {
                    algorithm: 'HS256',
                    expiresIn: jwtExpirySeconds
                  });
                res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 })              
                res.send({ redirect: '/patientportal.html'});
              }
          });
      } else {
          console.log("Incorrect user name or password!!");
      }
  });
});

app.post('/insertemp', function (req, res) {
  var efname = req.body.employeefirstname;
  var elname = req.body.employeelastname;
  var ephone = req.body.employeephone;
  var eemail = req.body.employeeemail;  
  var eaddress = req.body.employeeaddress;
  var ecity = req.body.employeecity;
  var estate = req.body.employeestate;
  var ezip = req.body.employeezip;
  var esd = req.body.employeestartdate;
  var epos = req.body.employeeposition; 
  var epay = req.body.employeepayrate;
  var epwd = req.body.employeepwd;

  var saltRounds = 10;
  var theHashedPW = '';

  bcrypt.hash(epwd, saltRounds, function (err, hashedPassword) {

      if (err) {
          ("Bad on encrypt");
          return;
      } else {
          
          theHashedPW = hashedPassword;

          var sqlins = "INSERT INTO employeeInfo (empfirstname, emplastname, empphone, "
          + " empemail, empaddress, empcity, empstate, empzip, empstartdate, positionID , emppayrate, emppwd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

          var inserts = [efname, elname, ephone, eemail, eaddress, ecity, estate, ezip, esd, epos, epay, theHashedPW];

          var sql = mysql.format(sqlins, inserts);

          con.execute(sql, function (err, result) {
              if (err) throw err;
              ("1 record inserted");
              res.redirect('index.html');
              res.end();
            });
          }
      });
  });

app.post('/loginemp/', function (req, res) {
  var eemail = req.body.empemail;
  var epwd = req.body.emppwd;

  var sqlsel = 'select * from employeeInfo where empemail = ?';

  var inserts = [eemail];

  var sql = mysql.format(sqlsel, inserts);
  con.query(sql, function (err, data)     {
      //Checks to see if there is data in the result
      if (data.length > 0) {
          var empkey = data[0].empid;

          bcrypt.compare(epwd, data[0].emppwd, function (err, passwordCorrect ) {
              if (err) {
                  throw err;
              } else {
                  const token = jwt.sign({ empkey }, jwtKey, {
                    algorithm: 'HS256',
                    expiresIn: jwtExpirySeconds
                  });
                
                res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 })
                res.send({ redirect: '/employees/searchemp.html'});
              }
          });
      }
  });
});

app.post('/insertapptdetails', function (req, res) {
    var appt = req.body.appointment;
    var drnotes = req.body.drnotes;
    var patientsymp = req.body.patientsymp;  
    var medpresc = req.body.medpresc;  

    var sqlins = "INSERT INTO appointmentdetails (appointmentid, patientsymptoms, doctornotes,  prescribedmeds) VALUES (?, ?, ?, ?)";

    var inserts = [appt, patientsymp,  drnotes, medpresc];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        ("1 record inserted"); 
        res.end();
    });
});

app.post('/insertappt', function (req, res) {
    var apptdate = req.body.appointmentdate;
    var empid = req.body.empid;
    var patientid = req.body.patientid;  
    var appttime = req.body.appointmenttime;

    var sqlins = "INSERT INTO appointment (appointmentdate, appointmenttime, empid, patientid) VALUES (?, ?, ?, ?)";

    var inserts = [apptdate, appttime, empid, patientid];

    var sql = mysql.format(sqlins, inserts);
    con.execute(sql, function (err, result) {
        if (err) throw err;
        ("1 record inserted");
        res.redirect('/employees/insertapptdetails.html');
    });
});

app.post('/insertapptpatient', function (req, res) {
    var apptdate = req.body.appointmentdate2;
    var appttime = req.body.appointmenttime2;
    var empid = req.body.empid;

    var sqlins = "INSERT INTO appointment (appointmentdate, appointmenttime, empid, patientid) VALUES (?, ?, ?, ?)";

    var inserts = [apptdate, appttime, empid, ""];

    var sql = mysql.format(sqlins, inserts);
    con.execute(sql, function (err, result) {
        if (err) throw err;
        ("1 record inserted");
        res.redirect('/employees/insertapptdetails.html');
    });
});

app.post('/insertitem', function (req, res) {
    var itemname = req.body.itemname;
    var itemdescr = req.body.itemdescr;
    var itemprice = req.body.itemprice;
    var itemstock = req.body.itemstock;  

    var sqlins = "INSERT INTO shopitems (itemname, itemdesc, itemprice, iteminstock) VALUES (?, ?, ?, ?)";

    var inserts = [itemname, itemdescr, itemprice, itemstock];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        ("1 record inserted");
        res.redirect('/employees/searchitems.html');
    });
});

app.post('/insertorder', function (req, res) {
    var orderdate = req.body.orderdate2;
    var orderpurchaseid = req.body.orderpurchaseid2;
    var ordertotal = req.body.ordertotal2;  
    var orderdiscount = req.body.orderdiscount2;  

    var sqlins = "INSERT INTO orderinfo (orderdate, orderpurchaseid, ordertotal, orderdiscount) VALUES (?, ?, ?, ?)";

    var inserts = [orderdate, orderpurchaseid, ordertotal, orderdiscount];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        ("1 record inserted");  
    });
});

app.get('/getemppositions/', function (req, res) {
    
    var sqlsel = 'SELECT * FROM emppositions';
    var sql = mysql.format(sqlsel);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getemps', function (req, res) {
    var eid = req.query.employeeid;
    var efname = req.query.employeefirstname;
    var elname = req.query.employeelastname;
    var ephone = req.query.employeephone;
    var eemail = req.query.employeeemail;  
    var eaddress = req.query.employeeaddress;
    var ecity = req.query.employeecity;
    var estate = req.query.employeestate;
    var ezip = req.query.employeezip;
    var esd = req.query.employeestartdate; 
    var epay = req.query.employeepayrate;

    var sqlsel =
    "SELECT employeeInfo.*, emppositions.positionname FROM employeeInfo " +
    "inner join emppositions on emppositions.positionID = employeeInfo.positionID " +
    "WHERE empid LIKE ? AND empfirstname LIKE ? AND emplastname LIKE ? AND empphone LIKE ? AND " +
    "empemail LIKE ? AND empaddress LIKE ? AND empcity LIKE ? AND empstate LIKE ? AND " +
    "empzip LIKE ? AND empstartdate LIKE ? AND emppayrate LIKE ? " ;

    var inserts = ['%' + eid + '%', '%' + efname + '%', '%' + elname + '%', '%' + ephone + '%', '%' + eemail + '%', '%' + eaddress + '%', '%' + ecity + '%', '%' + estate + '%', '%' + ezip + '%', '%' + esd + '%', '%' + epay + '%'];

    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getpats', function (req, res) {
    var pid = req.query.patientid;
    var pfname = req.query.patientfirstname;
    var plname = req.query.patientlastname;
    var pdob = req.query.patientdob;
    var pemail = req.query.patientemail;  
    var pphone = req.query.patientphone;
    var paddress = req.query.patientaddress;
    var pcity = req.query.patientcity;
    var pstate = req.query.patientstate;
    var pzip = req.query.patientzip;
    var pins = req.query.patientinsurance;
    var sqlsel = "SELECT * FROM patientInfo WHERE patientid LIKE ? " +
    "AND patientfirstname LIKE ? AND patientlastname LIKE ? " +
    "AND patientdob LIKE ? AND patientemail LIKE ? AND patientphone LIKE ? " +
    "AND patientaddress LIKE ? AND patientcity LIKE ? AND patientstate LIKE ? AND patientzip LIKE ? AND patientinsurance LIKE ?";

    var inserts = [
        '%' + pid + '%',
        '%' + pfname + '%',
        '%' + plname + '%',
        '%' + pdob + '%',
        '%' + pemail + '%',
        '%' + pphone + '%',
        '%' + paddress + '%',
        '%' + pcity + '%',
        '%' + pstate + '%',
        '%' + pzip + '%', 
        '%' + pins + '%'
    ];    
    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
            
        
    });
});

app.get('/getdoctors', function (req, res) {
    
    var sqlsel = 'SELECT * FROM employeeInfo WHERE positionID = 2';
    var sql = mysql.format(sqlsel);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getpatients', function (req, res) {
    
    var sqlsel = 'SELECT * FROM patientInfo';
    var sql = mysql.format(sqlsel);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});


app.get('/getappt', function (req, res) {
    var apptid = req.query.appointmentid;
    var apptdate = req.query.appointmentdate;
    var appttime = req.query.appointmenttime;
    var empid = req.query.empid;
    var pid = req.query.patientid;
    
    var sqlsel = "SELECT * FROM appointment WHERE appointmentid LIKE ? " +
    "AND patientid LIKE ? AND empid LIKE ? AND appointmentdate LIKE ? AND appointmenttime LIKE ?";

    var inserts = [
        '%' + apptid + '%',
        '%' + pid + '%',
        '%' + empid + '%',
        '%' + apptdate + '%',  
        '%' + appttime + '%',  

    ];
    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getappts', function (req, res) {
    var apptid = req.query.appointmentid;
    var apptdate = req.query.appointmentdate;
    var appttime = req.query.appointmenttime;
    var empid = req.query.empid;
    var pid = req.query.patientid;
    
    var sqlsel = "SELECT * FROM appointment WHERE appointmentid LIKE ? " +
    "AND patientid LIKE ? AND empid LIKE ? AND appointmentdate LIKE ? AND appointmenttime LIKE ?";

    var inserts = [
        '%' + apptid + '%',
        '%' + pid + '%',
        '%' + empid + '%',
        '%' + apptdate + '%',
        '%' + appttime + '%',     
    ];
    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getapptspatient', function (req, res) {

    var pid = req.query.patientid;
    
    var sqlsel = "SELECT appointment.* , patientInfo.*, employeeInfo.* FROM appointment " +
    "inner join patientInfo USING (patientid) inner join employeeInfo USING(empid) WHERE patientid LIKE ? " ;

    var inserts = ['%' + pid + '%'];
    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function(err, data) { 
        
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getapptdetails', function (req, res) {
    var apptid = req.query.appointmentid;
    var patientsymptoms = req.query.patsymps;
    var doctornotes = req.query.drnotes;
    var prescribedmeds = req.query.medications;
    
    var sqlsel = "SELECT * FROM appointmentdetails WHERE appointmentid LIKE ? " +
    "AND patientsymptoms LIKE ? AND doctornotes LIKE ? AND prescribedmeds LIKE ?";

    var inserts = [
        '%' + apptid + '%',
        '%' + patientsymptoms + '%',
        '%' + doctornotes + '%',
        '%' + prescribedmeds + '%',     
    ];
    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getapptids', function (req, res) {
    
    var sqlsel = 'SELECT * FROM appointment';
    var sql = mysql.format(sqlsel);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getapptidsfordetails', function (req, res) {
    
    var sqlsel = 'SELECT * FROM appointment';
        
    var sql = mysql.format(sqlsel);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getsingleemp/', function (req, res) {

    var ekey = req.query.upempkey;

    var sqlsel = 'select * from employeeInfo where empid = ?';
    var inserts = [ekey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});

app.post('/updatesingleemp', function (req, res, ) {

    var eid = req.body.upemployeeid2;
    var efname = req.body.upemployeefirstname2;
    var elname = req.body.upemployeelastname2;
    var ephone = req.body.upemployeephone2;
    var eemail = req.body.upemployeeemail2;  
    var eaddress = req.body.upemployeeaddress2;
    var ecity = req.body.upemployeecity2;
    var estate = req.body.upemployeestate2;
    var ezip = req.body.upemployeezip2;
    var esd = req.body.upemployeestartdate2;
    var eed = req.body.upemployeeenddate2;
    var epos = req.body.upemployeeposition2; 
    var epay = req.body.upemployeepayrate2;
    
    var sqlins = "UPDATE employeeInfo SET empfirstname = ?, emplastname = ?, " +
        " empphone = ?, empemail = ?, empaddress = ?, empcity =?, empstate = ?, " +
        " empzip = ?, empstartdate = ?, empenddate = ?, positionID = ?, emppayrate = ? " +
        " WHERE empid = ? ";
    var inserts = [efname, elname, ephone, eemail, eaddress, ecity, estate, ezip, esd, eed, epos, epay, eid];

    var sql = mysql.format(sqlins, inserts);
    (sql);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            ("1 record updated");
            
            res.end();
        });
});   
app.get('/getsinglepat/', function (req, res) {

    var pkey = req.query.uppatkey;

    var sqlsel = 'select * from patientInfo where patientid = ?';
    var inserts = [pkey];

    var sql = mysql.format(sqlsel, inserts);
    (sql);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});

app.post('/updatesinglepat', function (req, res, ) {

    var pid = req.body.uppatientid2;
    var pfname = req.body.uppatientfirstname2;
    var plname = req.body.uppatientlastname2;
    var pdob = req.body.uppatientdob2;
    var pemail = req.body.uppatientemail2;  
    var pphone = req.body.uppatientphone2;
    var paddress = req.body.uppatientaddress2;
    var pcity = req.body.uppatientcity2;
    var pstate = req.body.uppatientstate2;
    var pzip = req.body.uppatientzip2;
    var pins = req.body.uppatientinsurance2;

    var sqlins = "UPDATE patientInfo SET patientfirstname = ?, patientlastname = ?, " +
        " patientdob = ?, patientemail = ?, patientphone = ?, patientaddress =?, patientcity = ?, " +
        " patientstate = ?, patientzip = ?, patientinsurance = ? WHERE patientid = ? ";
    var inserts = [ pfname, plname, pdob, pemail, pphone, paddress, pcity, pstate, pzip, pins, pid ];

    var sql = mysql.format(sqlins, inserts);
    (sql);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            ("1 record updated");
            
            res.end();
        });
});   
app.get('/getsingleappt/', function (req, res) {

    var akey = req.query.upapptkey;

    var sqlsel = 'select * from appointment where appointmentid = ?';
    var inserts = [akey];

    var sql = mysql.format(sqlsel, inserts);
    (sql);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});

app.post('/updatesingleappt', function (req, res, ) {

    var aid = req.body.upappointmentid;
    var adate = req.body.upappointmentdate;
    var atime = req.body.upappointmenttime;
    var eid = req.body.upempid;
    var pid = req.body.uppatientid;
    
    var sqlins = "UPDATE appointment SET appointmentdate = ?, appointmenttime = ?, empid = ?, patientid = ? " +
        " WHERE  appointmentid = ? ";
    var inserts = [adate, atime, eid, pid, aid];

    var sql = mysql.format(sqlins, inserts);
    (sql);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            ("1 record updated");
            
            res.end();
        });
});   
app.get('/getsingleapptdetail/', function (req, res) {

    var adkey = req.query.upapptkey;

    var sqlsel = 'select * from appointmentdetails where appointmentid = ?';
    var inserts = [adkey];

    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});

app.post('/updatesingleapptdetail', function (req, res, ) {

    
    var adid = req.body.upappointmentdetailsid2;
    var aid = req.body.upappointmentid2;
    var patsymps = req.body.uppatientsymptoms2;
    var drnotes = req.body.updrnotes2;
    var meds = req.body.upmedications2;
    
    var sqlins = "UPDATE appointmentdetails SET appointmentid = ?, patientsymptoms = ?, doctornotes = ?, prescribedmeds = ? " +
        " WHERE  appointmentdetailsid = ? ";
    var inserts = [aid, patsymps, drnotes, meds, adid];

    var sql = mysql.format(sqlins, inserts);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            ("1 record updated");
            
            res.end();
        });
});   

app.get('/getitems/', function(req, res){

    var itemid = req.query.itemid;
    var itemname = req.query.itemname;
    var itemdesc = req.query.itemdescr;
    var itemprice = req.query.itemprice;
    var iteminstock = req.query.itemstock;

    var sqlsel = 'SELECT * FROM shopitems WHERE itemid LIKE ? AND itemname LIKE ? AND itemdesc LIKE ? AND itemprice LIKE ? AND iteminstock LIKE ?';

    var inserts = ['%' + itemid + '%', '%' + itemname + '%', '%' + itemdesc + '%', '%' + itemprice + '%', '%' + iteminstock + '%'];
    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getitemsfororderdetails/', function(req, res){

    var sqlsel = 'SELECT * FROM shopitems';

    var sql = mysql.format(sqlsel);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getsingleitem/', function (req, res) {

    var itemkey = req.query.upitemkey;

    var sqlsel = 'select * from shopitems where itemid = ?';
    var inserts = [itemkey];

    var sql = mysql.format(sqlsel, inserts);
    (sql);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});

app.post('/updatesingleitem', function (req, res, ) {


    var itemid = req.body.upitemid2;
    var name = req.body.upitemname2;
    var desc = req.body.upitemdescr2;
    var price = req.body.upitemprice2;
    var stock = req.body.upitemstock2;
    
    var sqlins = "UPDATE shopitems SET itemname = ?, itemdesc = ?, itemprice = ?,  iteminstock = ? " +
        " WHERE itemid = ? ";
    var inserts = [name, desc, price, stock, itemid];

    var sql = mysql.format(sqlins, inserts);
    (sql);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            ("1 record updated");
            
            res.end();
        });
});   
app.get('/getorders/', function(req, res){

    var orderid = req.query.orderid;
    var orderpurchaseid = req.query.orderpurchaseid;
    var orderdate = req.query.orderdate;
    var ordertotal = req.query.ordertotal;
    var orderdiscount = req.query.orderdiscount;

    var sqlsel = 'SELECT * FROM orderinfo WHERE orderid LIKE ? AND orderpurchaseid LIKE ? AND orderdate LIKE ? AND ordertotal LIKE ? AND orderdiscount LIKE ?';

    var inserts = ['%' + orderid + '%', '%' + orderpurchaseid + '%', '%' + orderdate + '%', '%' + ordertotal + '%', '%' + orderdiscount + '%'];

    var sql = mysql.format(sqlsel, inserts);
    (sql);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getorderdetailids/', function(req, res){

    var sqlsel = 'SELECT * FROM orderinfo';

    var sql = mysql.format(sqlsel);

    
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getsingleorder/', function (req, res) {

    var orderkey = req.query.uporderkey;

    var sqlsel = 'select * from orderinfo where orderid = ?';
    var inserts = [orderkey];

    var sql = mysql.format(sqlsel, inserts);
    (sql);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});

app.post('/updatesingleorder', function (req, res, ) {

    var orderid = req.body.uporderid2;
    var orderpurchaseid = req.body.uporderpurchaseid2;
    var orderdate = req.body.uporderdate2;
    var ordertotal = req.body.upordertotal2;
    var orderdiscount = req.body.uporderdiscount2;
    
    var sqlins = "UPDATE orderinfo SET orderpurchaseid = ?, orderdate = ?, ordertotal = ?, orderdiscount = ? " +
        " WHERE orderid = ? ";
    var inserts = [orderpurchaseid, orderdate, ordertotal, orderdiscount, orderid];

    var sql = mysql.format(sqlins, inserts);
    (sql);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            ("1 record updated");
            
            res.end();
        });
});   
app.get('/getorderdetails/', function(req, res){

   
    var orderpurchaseid = req.query.orderpurchaseid;
    var itemid = req.query.itemid;
    var itemname = req.query.itemname;
    var itemprice = req.query.itemprice;
    var qtyordered = req.query.qtyordered;

    var sqlsel = 'SELECT * FROM itemspurchased WHERE orderpurchaseid LIKE ? AND itemid LIKE ? AND itemname LIKE ? AND itemprice LIKE ? AND qtyordered LIKE ?';

    var inserts = ['%' + orderpurchaseid + '%', '%' + itemid + '%', '%' + itemname + '%', '%' + itemprice + '%', '%' + qtyordered + '%'];

    var sql = mysql.format(sqlsel, inserts);
    (sql);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getsingleorderdetails/', function (req, res) {

    var orderdetailskey = req.query.uporderdetailkey;

    var sqlsel = 'select * from itemspurchased where orderpurchaseid = ?';
    var inserts = [orderdetailskey];

    var sql = mysql.format(sqlsel, inserts);
    (sql);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});

app.post('/insertorderdetails', function (req, res, ) {

    var itemid = req.body.itemid2;
    var itemname = req.body.itemname2;
    var itemprice = req.body.itemprice2;
    var qtyordered = req.body.itemqty2;
    
    var sqlins = "INSERT INTO itemspurchased (itemid, itemname, itemprice, qtyordered) ";
    var inserts = [itemid, itemname, itemprice, qtyordered];

    var sql = mysql.format(sqlins, inserts);
    (sql);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            ("1 record updated");
            
            res.end();
        });
});   

app.post('/updatesingleorderdetail', function (req, res, ) {

    var orderpurchaseid = req.body.uporderpurchaseid2;
    var itemid = req.body.upitemid2;
    var itemname = req.body.upitemname2;
    var itemprice = req.body.upitemprice2;
    var qtyordered = req.body.upqtyordered2;
    
    var sqlins = "UPDATE itemspurchased SET itemid = ?, itemname = ?, itemprice = ?, qtyordered = ? " +
        " WHERE orderpurchaseid = ? ";
    var inserts = [itemid, itemname, itemprice, qtyordered, orderpurchaseid];

    var sql = mysql.format(sqlins, inserts);
    (sql);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            ("1 record updated");
            
            res.end();
        });
});   

app.listen(app.get("port"), function () {
  ("Server started: http://localhost:" + app.get("port") + "/");
});
