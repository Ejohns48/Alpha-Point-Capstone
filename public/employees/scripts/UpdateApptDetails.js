var ApptDetailsBox = React.createClass({
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
    loadApptDetailsFromServer: function () {

        $.ajax({
            url: '/getapptdetails',
            data: {
                'appointmentid': appointmentid.value,
                'drnotes': drnotes.value,                
                'patsymps': patientsymptoms.value, 
                'medications': medications.value,  
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
    updateSingleApptDetailFromServer: function (apptdetails) {
        
        $.ajax({
            url: '/updatesingleapptdetail',
            dataType: 'json',
            data: apptdetails,
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
        this.loadApptDetailsFromServer();
        }
    },

    render: function () {
                if (this.state.viewthepage == 1 || this.state.viewthepage == 2) {
            return (
                <div>
                
                <ApptDetailsform2   id="PatientList" onApptSubmit={this.loadApptDetailsFromServer} />
                <br />
                <table className="patienttable">
                        <thead>
                            <tr>                                   
                                <th>Appointment ID</th>                             
                                <th>Doctor Notes</th>
                                <th>Patient Symptoms</th>
                                <th>Prescribed Medications</th>
                            </tr>
                         </thead>
                        <ApptDetailsList data={this.state.data} />
                    </table>
                        <ApptDetailsUpdateform onUpdateSubmit={this.updateSingleApptDetailFromServer} />
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

var ApptDetailsform2 = React.createClass({
    getInitialState: function () {
        return {
            appointmentid: "",
            drnotes: "",
            patientsymptoms: "",
            medications: "",
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    handleSubmit: function (e) {
        e.preventDefault();

        
        var appointmentid = this.state.appointmentid.trim();
        var drnotes = this.state.drnotes.trim();        
        var patientsymptoms = this.state.patientsymptoms.trim();
        var medications = this.state.medications.trim();              

        this.props.onApptSubmit({ 
            appointmentid: appointmentid,
            drnotes: drnotes,            
            patientsymptoms: patientsymptoms,
            medications: medications,
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
            <form id="Patientform" onSubmit={this.handleSubmit}>
                <h2> Search Appointment Details</h2>
                <table>
                    <tbody>
                    <tr>
                            <th>Appointment ID</th>
                            <td>
                            <input type="text" name="appointmentid" id="appointmentid" value={this.state.appointmentid} onChange={this.handleChange} />
                            </td>
                        </tr>
                    <tr>
                            <th>Doctor Notes</th>
                            <td>
                                <input type="text" name="drnotes" id="drnotes" value={this.state.drnotes} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Symptoms</th>
                            <td>
                            <input type="text" name="patientsymptoms" id="patientsymptoms" value={this.state.patientsymptoms} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Prescribed Medications</th>
                            <td>
                            <input type="text" name="medications" id="medications" value={this.state.medications} onChange={this.handleChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search Appointment Details" />

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

var ApptDetailsUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upappointmentdetailsid2: "",
            upappointmentid2: "",
            updrnotes2: "",
            uppatientsymptoms2: "",
            upmedications2: "",
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    handleUpSubmit: function (e) {
        e.preventDefault();
        var upappointmentdetailsid2 = upapptdetailsid.value;
        var upappointmentid2 = upappointmentid.value;
        var updrnotes2 = updrnotes.value;        
        var uppatientsymptoms2 = uppatientsymptoms.value;
        var upmedications2 = upmedications.value;

        this.props.onUpdateSubmit({
            upappointmentdetailsid2: upappointmentdetailsid2,
            upappointmentid2: upappointmentid2,
            updrnotes2: updrnotes2,             
            uppatientsymptoms2: uppatientsymptoms2, 
            upmedications2: upmedications2,   
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
                    <form id="Patientform" onSubmit={this.handleUpSubmit}>
                    <h1>Update Appointment Detail</h1>
                        <table>
                            <tbody>
                            <tr>                            
                            <td>
                            <input type="hidden" name="upapptdetailsid" id="upapptdetailsid" value={this.state.upapptdetailsid} onChange={this.handleUpChange} />
                            </td>

                        </tr>
                            <tr>
                            <th>Appointment ID</th>
                            <td>
                            <input type="text" name="upappointmentid" id="upappointmentid" value={this.state.upappointmentid} onChange={this.handleUpChange} />
                            </td>

                        </tr>
                            <tr>
                            <th>Patient Symptoms</th>
                            <td>
                                <input type="text" name="uppatientsymptoms" id="uppatientsymptoms" value={this.state.uppatientsymptoms} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Doctor Notes</th>
                            <td>
                            <input type="text" name="updrnotes" id="updrnotes" value={this.state.updrnotes} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Prescribed Medications</th>
                            <td>
                            <textarea rows="4" cols="21" name="upmedications" id="upmedications" value={this.state.upmedications} onChange={this.handleUpChange} />
                            </td>
                        </tr>
</tbody>
                        </table><br />
                        <input type="hidden" name="upapptdetailkey" id="upapptdetailkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Appointment Details" />
                    </form>
                </div>
        );
    }
});

var ApptDetailsList = React.createClass({
    render: function () {
        var apptDetailsNodes = this.props.data.map(function (appointmentdetails) {
            return (
                <AppointmentDetails
                key={appointmentdetails.appointmentdetailsid}
                apptdetailskey={appointmentdetails.appointmentdetailsid}
                apptid={appointmentdetails.appointmentid}
                drnotes={appointmentdetails.doctornotes}
                patsymps={appointmentdetails.patientsymptoms}
                meds={appointmentdetails.prescribedmeds}
                >
                </AppointmentDetails>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {apptDetailsNodes}
            </tbody>
        );
    }
});

var AppointmentDetails = React.createClass({
    getInitialState: function () {
        return {
            upapptdetailskey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupapptdetailskey = this.props.apptdetailskey;
        
        this.loadSingleAppt(theupapptdetailskey);
    },
    loadSingleAppt: function (theupapptdetailskey) {
        
        $.ajax({
            url: '/getsingleapptdetail',
            data: {
                'upapptdetailskey': theupapptdetailskey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log("SINGLE DATA: ",this.state.singledata);
                var populateApptDetails = this.state.singledata.map(function (appointmentdetails) {
                    upapptdetailsid.value = appointmentdetails.appointmentdetailsid;
                    uppatientsymptoms.value = appointmentdetails.patientsymptoms;
                    upappointmentid.value = appointmentdetails.appointmentid;
                    updrnotes.value = appointmentdetails.doctornotes;
                    upmedications.value = appointmentdetails.prescribedmeds;                                  
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
                                {this.props.drnotes}
                            </td>
                            <td>
                                {this.props.patsymps}
                            </td>
                            <td>
                            {this.props.meds}  
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
    <ApptDetailsBox />,
    document.getElementById('content')
);