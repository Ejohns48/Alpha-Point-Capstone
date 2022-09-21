var ApptBox = React.createClass({
    getInitialState: function () {
        return { data: [], data2: [],viewthepage: 0 };
    },
    loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedin',
            dataType: 'json',
            cache: false,
            success: function (datalog) {
                this.setState({ data2: datalog });                
                this.setState({ viewthepage: this.state.data2[0].positionID });     
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadApptsFromServer: function () {

        $.ajax({
            url: '/getappt',
            data: {
                'appointmentid': appointmentid.value,
                'patientid': patientid.value,                
                'empid': empid.value, 
                'appointmentdate': appointmentdate.value,  
                'appointmenttime': appointmenttime.value,
            },            
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    updateSingleApptFromServer: function (appt) {
        
        $.ajax({
            url: '/updatesingleappt',
            dataType: 'json',
            data: appt,
            type: 'POST',
            cache: false,
            success: function (upsingledata) {
                this.setState({ upsingledata: upsingledata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        window.location.reload(true);
    },
    componentDidMount: function () {
        this.loadAllowLogin();
        if (this.state.viewthepage != 0) {
            this.loadApptsFromServer();
            }
    }, 
    render: function () {
                if (this.state.viewthepage == 1 || this.state.viewthepage == 2) {
            return (
                <div>
                
                <Apptform2 id="PatientList" onApptSubmit={this.loadApptsFromServer} />
                <br />
                <table className="patienttable">
                        <thead>
                            <tr>                                   
                                <th>Appointment ID</th>                             
                                <th>Patient</th>
                                <th>Employee</th>
                                <th>Appointment Date</th>
                                <th>Appointment Time</th>
                                <th></th>
                            </tr>
                         </thead>
                        <ApptList data={this.state.data} />
                    </table>
                        <ApptUpdateform  id="PatientList" onUpdateSubmit={this.updateSingleApptFromServer} />
                    </div>                
            );
        } else {
        return (
            <div  className="accessMessage">
                <h1>Access Denied</h1>
                <p><strong>Please contact your system administrator for privileges.</strong></p>
                </div>
            
        );
        }
    }
});

var Apptform2 = React.createClass({
    
    getInitialState: function () {
        return {
            appointmentid: "",
            patientid: "",
            empid: "",
            appointmentdate: "",
            appointmenttime: "",
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var patientid2 = this.state.patientid.trim();
        var appointmentid2 = this.state.appointmentid.trim();
        var empid2 = this.state.empid.trim();
        var appointmentdate2 = this.state.appointmentdate.trim();    
        var appointmenttime2 = this.state.appointmenttime.trim();          

        this.props.onApptSubmit({ 
            patientid: patientid2,
            appointmentid: appointmentid2,
            empid: empid2,
            appointmentdate: appointmentdate2,
            appointmenttime: appointmenttime2,
        });

    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
        <div>
            <div id="PatientSearchBox">
            <form  id="Patientform" onSubmit={this.handleSubmit}>
                <h2>Search Appointments</h2>
                <table>
                    <tbody>
                    <tr>
                            <th>Appointment ID</th>
                            <td>
                            <input type="text" name="appointmentid" id="appointmentid" value={this.state.appointmentid} onChange={this.handleChange} />
                            </td>
                        </tr>
                    <tr>
                            <th>Patient ID</th>
                            <td>
                                <input type="text" name="patientid" id="patientid" value={this.state.patientid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee ID</th>
                            <td>
                            <input type="text" name="empid" id="empid" value={this.state.empid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Date</th>
                            <td>
                            <input type="date" name="appointmentdate" id="appointmentdate" value={this.state.appointmentdate} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Time</th>
                            <td>
                            <input type="time" name="appointmenttime" id="appointmenttime" value={this.state.appointmenttime} onChange={this.handleChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search Appointments" />

            </form>
            <div>
                    <br />
                    <form onSubmit={this.getInitialState}>
                        <input type="submit" value="Clear Form" />
                    </form>
            </div>
            </div>

        </div>
        );
    }
});

var ApptUpdateform = React.createClass({
    getInitialState: function () {
        return {
            
            upappointmentdate: "",
            upappointmenttime: "",
            updataemps: [],
            updatapats: [],
        };
    },


    loadEmps: function() {
        $.ajax({
            url: '/getdoctors',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({updataemps:data});
                console.log("DATA EMP :", updataemps)
            }.bind(this),
            
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadPatients: function() {
        $.ajax({
            url: '/getpatients',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({updatapats:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        if(this.state.viewthepage !=0){
        this.loadEmps();
        this.loadPatients();
        }
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        
        var uppatientid = uppatname.value;
        var upappointmentid = upappointmentid.value;
        var upempid = upempname.value;
        var upappointmentdate = upappointmentdate.value;
        var upappointmenttime = upappointmenttime.value;

        this.props.onUpdateSubmit({
            uppatientid: uppatientid,
            upappointmentid: upappointmentid, 
            upempid: upempid, 
            upappointmentdate: upappointmentdate,  
            upappointmenttime: upappointmenttime, 
        });
    },
    handleUpChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
                <div id="PatientSearchBox">
                    <form  id="Patientform" onSubmit={this.handleUpSubmit}>
                    <h1>Update Appointment</h1>
                        <table>
                            <tbody>
                            <tr>
                            <th>Patient ID</th>
                            <td>
                            <SelectList2 data={this.state.updatapats} />
                            </td>
                        </tr>
                        <tr>
                            
                            <td>
                            <input type="hidden" name="upappointmentid" id="upappointmentid" value={this.state.upappointmentid} onChange={this.handleUpChange} />
                            </td>

                        </tr>
                        <tr>
                            <th>Doctor ID</th>
                            <td>
                            <SelectList data={this.state.updataemps} />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Date</th>
                            <td>
                            <input type="date" name="upappointmentdate" id="upappointmentdate" value={this.state.upappointmentdate} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Time</th>
                            <td>
                            <input type="time" name="upappointmenttime" id="upappointmenttime" value={this.state.upappointmenttime} onChange={this.handleChange} />
                            </td>
                        </tr>
</tbody>
                        </table><br />
                        <input type="hidden" name="upapptkey" id="upapptkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Appointment" />
                    </form>
                </div>
        );
    }
});

var ApptList = React.createClass({
    render: function () {
        var apptNodes = this.props.data.map(function (appointment) {
            return (
                <Appointment
                key={appointment.appointmentid}
                apptkey={appointment.appointmentid}
                apptid={appointment.appointmentid}
                apptdate={appointment.appointmentdate}
                appttime={appointment.appointmenttime}
                patid={appointment.patientid}
                empid={appointment.empid}
                >
                </Appointment>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {apptNodes}
            </tbody>
        );
    }
});
var SelectList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (empName) {
            return (
                <option
                    key={empName.empid}
                    value={empName.empid}
                >
                    {empName.empfirstname} {empName.emplastname}
                </option>
            );
        });
        return (
            <select name="upempname" id="upempname">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});


var SelectList2 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (patName) {
            return (
                <option
                    key={patName.patientid}
                    value={patName.patientid}
                >
                    {patName.patientfirstname} {patName.patientlastname}
                </option>
            );
        });
        return (
            <select name="uppatname" id="uppatname">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});



var Appointment = React.createClass({
    getInitialState: function () {
        return {
            upapptkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupapptkey = this.props.apptkey;
        
        this.loadSingleAppt(theupapptkey);
    },
    loadSingleAppt: function (theupapptkey) {
        
        $.ajax({
            url: '/getsingleappt',
            data: {
                'upapptkey': theupapptkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log("SINGLE DATA: ",this.state.singledata);
                var populateAppt = this.state.singledata.map(function (appointment) {
                    upappointmentdate.value = new Date(appointment.appointmentdate).toISOString().slice(0,10);
                    upempname.value = appointment.empid;
                    uppatname.value = appointment.patientid;
                    upappointmenttime.value = appointment.appointmenttime;                                  
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        
    },

    render: function () {
        
        return (

            <tr>
                            <td>
                                {this.props.apptid}
                            </td>
                            <td>
                                {this.props.patid}
                            </td>
                            <td>
                                {this.props.empid}
                            </td>
                            <td>
                            {new Intl.DateTimeFormat("en-US", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: '2-digit'
                                }).format(new Date(this.props.apptdate))}
                                
                            </td>
                            <td>
                                {this.props.appttime}
                            </td>
                            <td>
                                <form onSubmit={this.updateRecord}>
                                    <input type="submit" value="Update Record" />
                                </form>
                            </td>
                </tr>
        );
    }
});

ReactDOM.render(
    <ApptBox />,
    document.getElementById('content')
);