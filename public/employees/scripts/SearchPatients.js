var PatientSearchBox = React.createClass({    
    
    getInitialState: function () {
        return { data: [], data2: [] ,viewthepage: 0 };   
          
    },
    loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedin',
            dataType: 'json',
            cache: false,
            success: function (datalog) {
                this.setState({ data2: datalog });                
                this.setState({ viewthepage: this.state.data2[0].positionID });   
                console.log("DATA: ",datalog); 
                console.log("VIEW THE PAGE: ",this.state.viewthepage);    
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
                console.log("Success: ", data);            
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
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
                <div  >
                
                <Patientform2 id="PatientList" onPatientSubmit={this.loadPatientsFromServer} />
                <br />
                <table className="patienttable"> 
                        <thead id="patientheadings">
                            <tr >                                   
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
                        <PatientList id='patientdatarow' data={this.state.data} />
                    </table>
                
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
            <div id="PatientSearchBox">
            <form id="Patientform" onSubmit={this.handleSubmit}>
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
             <tbody id="patientnodes">
                {patientNodes}
            </tbody>
        );
    }
});

var Patient = React.createClass({

    render: function () {
            return (
            <tr>
                            <td className="patientdata">
                                {this.props.patid}
                            </td>
                            <td className="patientdata">
                                {this.props.patfname}
                            </td>
                            <td className="patientdata">
                                {this.props.patlname}
                            </td>
                            <td className="patientdata">
                            {new Intl.DateTimeFormat("en-US", {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                }).format(new Date(this.props.patdob))} 
                            </td>
                            <td className="patientdata">
                                {this.props.patemail}
                            </td>
                            <td className="patientdata">
                                {this.props.patphone}
                            </td>
                            <td className="patientdata">
                                {this.props.pataddr}
                            </td>
                            <td className="patientdata">
                                {this.props.patcity}
                            </td>
                            <td className="patientdata">
                                {this.props.patstate}
                            </td>
                            <td className="patientdata">
                                {this.props.patzip}
                            </td>
                            <td className="patientdata">
                                {this.props.patins}
                            </td>
                </tr>
        );
    }
});

ReactDOM.render(
    <PatientSearchBox />,
    document.getElementById('content')
);