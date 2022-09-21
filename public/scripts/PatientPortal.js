

var ApptBox = React.createClass({
    getInitialState: function () {
        return { 
                data: [],
                data2: [],
                viewthepage: 0 ,
                upapptkey: "",
                patsymps: "",
                notes: "",
                meds: "",
                singledata: []};
    },
    loadAllowLogin: function () {

        $.ajax({
            url: '/getloggedinpatient',
            dataType: 'json',
            cache: false,
            success: function (datalog) {

                this.setState({ data2: datalog });  
                this.setState({ viewthepage: this.state.data2[0].patientid }); 
                this.loadApptsFromServer();
                
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadApptsFromServer: function () {
        
        $.ajax({
            url: '/getapptspatient',
            data: {                
                'patientid': this.state.viewthepage, 
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
        
                if (this.state.viewthepage == 0) {
            return (
                <div  className="accessMessage">
                <h1>Access Denied</h1>
                <p><strong>Please login to view this information.</strong></p>
                </div>
            );
        }
         else { 
        return (
            <div>
                <h1 className="greeting">Welcome {this.state.data2[0].patientfirstname}</h1>
                <Apptform2 onApptSubmit={this.loadApptsFromServer}  />
                
                <br />
                <table className="patienttable" id="detailstable">
                    <tr id="detailsout"></tr>
                    <tr id="detailsout2"></tr>
                </table>
                <table className="patienttable" id="patientappttable">
                        
                        <thead>
                            <tr>                                                                
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Appointment Date</th>
                                <th>Appointment Details</th>
                            </tr>
                         </thead>

                        <ApptList data={this.state.data} />

                </table>
            </div>                
        );
    }
    }

});

var Apptform2 = React.createClass({
    getInitialState: function () {
        return {
            patientid: "",
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    componentDidMount: function(){
        if (this.state.viewthepage != 0) {
            this.loadApptsFromServer;
        }
        
        
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var patientid = this.state.patientid.trim();

        this.props.onApptSubmit({ 
            patientid: patientid,
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
                    <h1>Click To Load Your Appointment History</h1>
                    <input type="hidden" name="patientid" id="patientid" value={this.state.patientid} onChange={this.handleChange} />
                    <input type="submit" value="Load Appointments" />
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
                patfname={appointment.patientfirstname}
                patlname={appointment.patientlastname}
                empfname={appointment.empfirstname}
                emplname={appointment.emplastname}
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


    getInitialState: function () {
        return { 
                singledata: []};
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupapptkey = this.props.apptkey;
        this.loadSingleApptDetails(theupapptkey);

    },
    loadSingleApptDetails: function (theupapptkey) {

        

        
        $.ajax({
            url: '/getsingleapptdetail',
            data: {
                'upapptkey': theupapptkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                var out = document.getElementById('detailsout');
                var out2 = document.getElementById('detailsout2');
                this.setState({ singledata: data });                                
                var drnotes = this.state.singledata[0].doctornotes;
                var patsymps = this.state.singledata[0].patientsymptoms;              
                var meds = this.state.singledata[0].prescribedmeds; 

                // if(out2.innerHTML.length != ""){out.innerHTML = "" && out2.innerHTML = "" }else{

                out.innerHTML = "<th>Doctor Notes</th><th>Patient Symptoms</th><th>Prescribed Medications</th><th></th>";
                out2.innerHTML = "<td>" + drnotes + "</td><td>" + patsymps + "</td><td>" + meds + "</td> <td></td>";
                
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
                                {this.props.patfname} {this.props.patlname}
                            </td>
                            <td>
                                {this.props.empfname} {this.props.emplname}
                            </td>
                            <td>
                            {new Intl.DateTimeFormat("en-US", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: '2-digit'
                                }).format(new Date(this.props.apptdate))}
                                
                            </td>
                            <td>
                                <form onSubmit={this.updateRecord}>
                                   <input type="submit" value="Load Appointment Details" />
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