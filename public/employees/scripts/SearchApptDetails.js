var ApptBox = React.createClass({    
    
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
                'appointmentid': apptid.value.split('-')[0],
                'drnotes': drnotes.value,                
                'patsymps': patsymps.value, 
                'medications': medications.value,        
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
          this.loadApptDetailsFromServer();
        }       
    },
    render: function () {
        if (this.state.viewthepage == 1 || this.state.viewthepage == 2) {
            return (
                <div>
                
                <Appointmentform2 id="PatientList" onApptSubmit={this.loadApptDetailsFromServer} />
                
                <div id="Appointment-data-table">
                    <table className="patienttable">
                        <thead>
                            <tr>                                   
                                <th className="Appointment-heading">Appointment ID</th>                             
                                <th className="Appointment-heading">Doctor Notes</th>
                                <th className="Appointment-heading">Patient Symptoms</th>
                                <th className="Appointment-heading">Prescribed Medications</th>
                            </tr>
                        </thead>
                        <ApptDetailsList data={this.state.data} />
                    </table>
                </div>
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

var Appointmentform2 = React.createClass({
    getInitialState: function () {
        return {            
            drnotes: "",
            patsymps: "",
            medications: "",
            data: [],
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadAppts: function() {
        $.ajax({
            url: '/getapptids',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data:data});
                console.log(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadAppts();
    },

    handleSubmit: function (e) {
        e.preventDefault();
        
        var appointmentid = apptid.value.split('-')[0].trim();
        var drnotes = this.state.drnotes.trim();
        var patsymps = this.state.patsymps.trim();
        var medications = this.state.medications.trim();         

        this.props.onApptSubmit({             
            appointmentid: appointmentid,
            drnotes: drnotes,
            patsymps: patsymps,
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
            <div id="PatientSearchBox">
            <form id="Patientform"  onSubmit={this.handleSubmit}>
                <h2>Search Appointment Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>
                                Appointment ID - Date
                            </th>
                            <td>
                                <SelectList data={this.state.data} />
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
                            <input type="text" name="patsymps" id="patsymps" value={this.state.patsymps} onChange={this.handleChange} />
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
                <input type="submit" value="Search Appointments" />
                
            </form>
            <div>
                    <br />
                    <form onSubmit={this.getInitialState}>
                        <input type="submit" value="Clear Form" />
                    </form>
                </div>
            </div>
        );
    }
});



var ApptDetailsList = React.createClass({
    render: function () {
        var appointmentDetailNodes = this.props.data.map(function (appointmentDetails) {
            
            return (
                <ApptDetails
                    key={appointmentDetails.appointmentdetailsid}                    
                    apptid={appointmentDetails.appointmentid}
                    drnotes={appointmentDetails.doctornotes}                   
                    patsymps={appointmentDetails.patientsymptoms}
                    medications={appointmentDetails.prescribedmeds}                    
                >
                </ApptDetails>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {appointmentDetailNodes}
            </tbody>
        );
    }
});

var ApptDetails = React.createClass({

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
                                {this.props.medications}
                            </td>
                </tr>
        );
    }
});

var SelectList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (appts) {
            return (
                
                <option
                    key={appts.appointmentid}
                    value={appts.appointmentid}
                >
                    
                    {appts.appointmentid}-{new Intl.DateTimeFormat("en-US", {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                }).format(new Date(appts.appointmentdate))}
                </option>
            );
        });
        return (
            <select name="apptid" id="apptid">
                <option key = "" value = ""></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <ApptBox />,
    document.getElementById('content')
);