var PatientBox = React.createClass({
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
    loadPatientsFromServer: function () {

        $.ajax({
            url: '/getpats',
            data: {
                'patientid': patientid.value,
                'patientfirstname': patientfirstname.value,
                'patientlastname': patientlastname.value, 
                'patientdob': patientdob.value,
                'patientemail': patientemail.value,
                'patientphone': patientphone.value,
                'patientaddress': patientaddress.value,
                'patientcity': patientcity.value,
                'patientstate': patientstate.value,
                'patientzip': patientzip.value,
                'patientinsurance': patientinsurance.value, 
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
    updateSinglePatFromServer: function (patient) {
        
        $.ajax({
            url: '/updatesinglepat',
            dataType: 'json',
            data: patient,
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
        this.loadPatientsFromServer();
        }
    },

    render: function () {
                if (this.state.viewthepage == 1 || this.state.viewthepage == 2) {
            return (
                <div>
                
                <Patientform2  id="PatientList" onPatientSubmit={this.loadPatientsFromServer} />
                <br />
                <table  className="patienttable">
                        <thead>
                            <tr>                                   
                                <th>ID</th>                             
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>D.O.B</th>
                                <th>Email</th>
                                <th>Phone</th>                                
                                <th>Address</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Zip</th>                                
                                <th>Insurance Provider</th>
                            </tr>
                         </thead>
                        <PatientList data={this.state.data} />
                    </table>
                        <PatientUpdateform  id="PatientList" onUpdateSubmit={this.updateSinglePatFromServer} />
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

var Patientform2 = React.createClass({
    getInitialState: function () {
        return {
            patientid: "",
            patientfirstname: "",
            patientlastname: "",
            patientdob: "",
            patientemail: "",
            patientphone: "",
            patientaddress: "",
            patientcity: "",
            patientstate: "",
            patientzip: "",
            patientinsurance: "",
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    handleSubmit: function (e) {
        e.preventDefault();

        var patientid = this.state.patientid.trim();
        var patientfirstname = this.state.patientfirstname.trim();
        var patientlastname = this.state.patientlastname.trim();
        var patientdob = this.state.patientdob.trim();        
        var patientemail = this.state.patientemail.trim();
        var patientphone = this.state.patientphone.trim();
        var patientaddress = this.state.patientaddress.trim();
        var patientcity = this.state.patientcity.trim();
        var patientstate = this.state.patientstate.trim();
        var patientzip = this.state.patientzip.trim();
        var patientinsurance = this.state.patientinsurance.trim();        

        this.props.onPatientSubmit({ 
            patientid: patientid,
            patientfirstname: patientfirstname,
            patientlastname: patientlastname,
            patientdob: patientdob,
            patientemail: patientemail,
            patientphone: patientphone,
            patientaddress: patientaddress,
            patientcity: patientcity,
            patientstate: patientstate,
            patientzip: patientzip,
            patientinsurance: patientinsurance,
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
                <h2>Search Patients</h2>
                <table>
                    <tbody>
                    <tr>
                            <th>Patient ID</th>
                            <td>
                                <input type="text" name="patientid" id="patientid" value={this.state.patientid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient First Name</th>
                            <td>
                            <input type="text" name="patientfirstname" id="patientfirstname" value={this.state.patientfirstname} onChange={this.handleChange} />
                            </td>

                        </tr>
                        <tr>
                            <th>Patient Last Name</th>
                            <td>
                            <input type="text" name="patientlastname" id="patientlastname" value={this.state.patientlastname} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient D.O.B</th>
                            <td>
                            <input type="date" name="patientdob" id="patientdob" value={this.state.patientdob} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Email</th>
                            <td>
                            <input type="text" name="patientemail" id="patientemail" value={this.state.patientemail} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Phone</th>
                            <td>
                            <input type="text" name="patientphone" id="patientphone" value={this.state.patientphone} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Address</th>
                            <td>
                            <input type="text" name="patientaddress" id="patientaddress" value={this.state.patientaddress} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient City</th>
                            <td>
                            <input type="text" name="patientcity" id="patientcity" value={this.state.patientcity} onChange={this.handleChange} />
                            </td>                            
                        </tr>
                        <tr>
                            <th>Patient State</th>
                            <td>
                            <input type="text" name="patientstate" id="patientstate" value={this.state.patientstate} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Zip</th>
                            <td>
                            <input type="text" name="patientzip" id="patientzip" value={this.state.patientzip} onChange={this.handleChange} />
                            </td>
                        </tr>                        
                        <tr>
                            <th>Patient Insurance</th>
                            <td>
                            <input type="text" name="patientinsurance" id="patientinsurance" value={this.state.patientinsurance} onChange={this.handleChange} />
                            </td>                          
                        </tr>                
                    </tbody>
                </table>
                <input type="submit" value="Search Patients" />

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

var PatientUpdateform = React.createClass({
    getInitialState: function () {
        return {
            uppatientid2: "",
            uppatientfirstname2: "",
            uppatientlastname2: "",
            uppatientdob2: "",
            uppatientemail2: "",
            uppatientphone2: "",
            uppatientaddress2: "",
            uppatientcity2: "",
            uppatientstate2: "",
            uppatientzip2: "",
            uppatientinsurance2: "",
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        
        var uppatientid2 = uppatientid.value;
        var uppatientfirstname2 = uppatientfirstname.value;
        var uppatientlastname2 = uppatientlastname.value;
        var uppatientdob2 = uppatientdob.value;
        var uppatientemail2 = uppatientemail.value;
        var uppatientphone2 = uppatientphone.value;
        var uppatientaddress2 = uppatientaddress.value;
        var uppatientcity2 = uppatientcity.value;
        var uppatientstate2 = uppatientstate.value;
        var uppatientzip2 = uppatientzip.value;
        var uppatientinsurance2 = uppatientinsurance.value;

        this.props.onUpdateSubmit({
            uppatientid2,
            uppatientfirstname2,
            uppatientlastname2,    
            uppatientdob2,        
            uppatientemail2,            
            uppatientphone2,
            uppatientaddress2,
            uppatientcity2,
            uppatientstate2,
            uppatientzip2,
            uppatientinsurance2,
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
                    <h1>Update Patient</h1>
                        <table>
                            <tbody>
                            <tr>
                            
                            <td>
                                <input type="hidden" name="uppatientid" id="uppatientid" value={this.state.uppatientid} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient First Name</th>
                            <td>
                            <input type="text" name="uppatientfirstname" id="uppatientfirstname" value={this.state.uppatientfirstname} onChange={this.handleUpChange} />
                            </td>

                        </tr>
                        <tr>
                            <th>Patient Last Name</th>
                            <td>
                            <input type="text" name="uppatientlastname" id="uppatientlastname" value={this.state.uppatientlastname} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient D.O.B</th>
                            <td>
                            <input type="date" name="uppatientdob" id="uppatientdob" value={this.state.uppatientdob} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Email</th>
                            <td>
                            <input type="text" name="uppatientemail" id="uppatientemail" value={this.state.uppatientemail} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Phone</th>
                            <td>
                            <input type="text" name="uppatientphone" id="uppatientphone" value={this.state.uppatientphone} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Address</th>
                            <td>
                            <input type="text" name="uppatientaddress" id="uppatientaddress" value={this.state.uppatientaddress} onChange={this.handleUpChange} />
                            </td>                            
                        </tr>
                        <tr>
                            <th>Patient City</th>
                            <td>
                            <input type="text" name="uppatientcity" id="uppatientcity" value={this.state.uppatientcity} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient State</th>
                            <td>
                            <input type="text" name="uppatientstate" id="uppatientstate" value={this.state.uppatientstate} onChange={this.handleUpChange} />
                            </td>
                        </tr>                        
                        <tr>
                            <th>Patient Zip</th>
                            <td>
                            <input type="text" name="uppatientzip" id="uppatientzip" value={this.state.uppatientzip} onChange={this.handleUpChange} />
                            </td>                          
                        </tr>
                        <tr>
                            <th>Patient Insurance</th>
                            <td>
                            <input type="text" name="uppatientinsurance" id="uppatientinsurance" value={this.state.uppatientinsurance} onChange={this.handleUpChange} />
                            </td>                          
                        </tr>
</tbody>
                        </table><br />
                        <input type="hidden" name="uppatkey" id="uppatkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Patient" />
                    </form>
                </div>
        );
    }
});

var PatientList = React.createClass({
    render: function () {
        var patientNodes = this.props.data.map(function (patient) {
            return (
                <Patient
                key={patient.patientid}
                patkey={patient.patientid}
                patid={patient.patientid}
                patfname={patient.patientfirstname}
                patlname={patient.patientlastname}
                patdob={patient.patientdob}
                patemail={patient.patientemail}
                patphone={patient.patientphone}                
                pataddr={patient.patientaddress}
                patcity={patient.patientcity}                    
                patstate={patient.patientstate}
                patzip={patient.patientzip}                 
                patins={patient.patientinsurance}
                >
                </Patient>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {patientNodes}
            </tbody>
        );
    }
});

var Patient = React.createClass({
    getInitialState: function () {
        return {
            uppatkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theuppatkey = this.props.patkey;
        
        this.loadSinglePat(theuppatkey);
    },
    loadSinglePat: function (theuppatkey) {
        
        $.ajax({
            url: '/getsinglepat',
            data: {
                'uppatkey': theuppatkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log("SINGLE DATA: ",this.state.singledata);
                var populatePat = this.state.singledata.map(function (patient) {
                    uppatientid.value = patient.patientid;                                       
                    uppatientfirstname.value = patient.patientfirstname;
                    uppatientlastname.value = patient.patientlastname;
                    uppatientdob.value = new Date(patient.patientdob).toISOString().slice(0,10);
                    uppatientemail.value = patient.patientemail;
                    uppatientphone.value = patient.patientphone;                     
                    uppatientaddress.value = patient.patientaddress;
                    uppatientcity.value = patient.patientcity;
                    uppatientstate.value = patient.patientstate;
                    uppatientzip.value = patient.patientzip;     
                    uppatientinsurance.value = patient.patientinsurance;
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
                                {this.props.patid}
                            </td>
                            <td>
                                {this.props.patfname}
                            </td>
                            <td>
                                {this.props.patlname}
                            </td>
                            <td>
                            {new Intl.DateTimeFormat("en-US", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: '2-digit'
                                }).format(new Date(this.props.patdob))}   
                            </td>
                            <td>
                                {this.props.patemail}
                            </td>
                            <td>
                                {this.props.patphone}
                            </td>
                            <td>
                                {this.props.pataddr}
                            </td>
                            <td>
                                {this.props.patcity}
                            </td>
                            <td>
                                {this.props.patstate}
                            </td>
                            <td>
                                {this.props.patzip}
                            </td>
                            <td>
                                {this.props.patins}
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
    <PatientBox />,
    document.getElementById('content')
);