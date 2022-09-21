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
            url: '/getappts',
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
    componentDidMount: function () {
        this.loadAllowLogin();    
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
                            </tr>
                         </thead>
                        <ApptList data={this.state.data} />
                    </table>
                    </div>        
            );
        }
         else {
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
    componentDidMount: function(){
        console.log("VIEWPAGE",this.state.viewthepage);
        if (this.state.viewthepage != 0) {
            this.loadApptsFromServer()
        }
    },
    handleSubmit: function (e) {
        e.preventDefault();

        var patientid = this.state.patientid.trim();
        var appointmentid = this.state.appointmentid.trim();
        var empid = this.state.empid.trim();
        var appointmentdate = this.state.appointmentdate.trim();   
        var appointmenttime = this.state.appointmenttime;           

        this.props.onApptSubmit({ 
            patientid: patientid,
            appointmentid: appointmentid,
            empid: empid,
            appointmentdate: appointmentdate,
            appointmenttime: appointmenttime,
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
            <div  id="PatientSearchBox">
            <form id="Patientform" onSubmit={this.handleSubmit}>
                <h1>Search Appointments</h1>
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
                <div>
                    <br />
                    <form onSubmit={this.getInitialState}>
                        <input type="submit" value="Clear Form" />
                    </form>
            </div>
            </form>
            </div>

        </div>
        );
    },

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

var Appointment = React.createClass({

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
                </tr>
        );
    }
});

ReactDOM.render(
    <ApptBox />,
    document.getElementById('content')
);