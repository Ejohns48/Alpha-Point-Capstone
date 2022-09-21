var EmployeeBox = React.createClass({
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
    loadEmployeesFromServer: function () {

        $.ajax({
            url: '/getemps',
            data: {
                'employeeid': employeeid.value,
                'employeefirstname': employeefirstname.value,
                'employeelastname': employeelastname.value, 
                'employeephone': employeephone.value,
                'employeeemail': employeeemail.value,
                'employeeaddress': employeeaddress.value,
                'employeecity': employeecity.value,
                'employeestate': employeestate.value,
                'employeezip': employeezip.value,
                'employeestartdate': employeestartdate.value,
                'employeeposition': emppos.value,
                'employeepayrate': employeepayrate.value,
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
    updateSingleEmpFromServer: function (employee) {
        
        $.ajax({
            url: '/updatesingleemp',
            dataType: 'json',
            data: employee,
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
        this.loadEmployeesFromServer();
        }
    },

    render: function () {
                if (this.state.viewthepage != 1) {
            return (
                <div  className="accessMessage">
                <h1>Access Denied</h1>
                <p><strong>Please contact your system administrator for privileges.</strong></p>
                </div>
            );
        } else {
        return (
            <div>
                
                <Employeeform2  id="PatientList" onEmployeeSubmit={this.loadEmployeesFromServer} />
                <br />
                    <table className="patienttable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Zip</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Position</th>
                                <th>Salary</th>
                            </tr>
                         </thead>
                        <EmployeeList data={this.state.data} />
                    </table>
                        <EmployeeUpdateform id="PatientList" onUpdateSubmit={this.updateSingleEmpFromServer} />
                    </div>                
        );
        }
    }
});

var Employeeform2 = React.createClass({
    getInitialState: function () {
        return {
            employeeid: "",
            employeefirstname: "",
            employeelastname: "",  
            employeephone: "",          
            employeeemail: "",            
            employeeaddress: "",
            employeecity: "",
            employeestate: "",
            employeezip: "",             
            employeestartdate:"",
            employeeposition: "",
            employeepayrate: "",
            data: []
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadEmpPositions: function() {
        $.ajax({
            url: '/getemppositions',
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
        this.loadEmpPositions();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var employeeid = this.state.employeeid.trim();
        var employeefirstname = this.state.employeefirstname.trim();
        var employeelastname = this.state.employeelastname.trim();
        var employeephone = this.state.employeephone.trim();        
        var employeeemail = this.state.employeeemail;
        var employeeaddress = this.state.employeeaddress.trim();
        var employeecity = this.state.employeecity.trim();
        var employeestate = this.state.employeestate.trim();
        var employeezip = this.state.employeezip.trim();
        var employeestartdate = this.state.employeestartdate.trim();        
        var employeeposition = emppos.value;
        var employeepayrate = this.state.employeepayrate.trim();

        this.props.onEmployeeSubmit({ 
            employeeid: employeeid,
            employeefirstname: employeefirstname,
            employeelastname: employeelastname,    
            employeephone: employeephone,        
            employeeemail: employeeemail,            
            employeeaddress: employeeaddress,
            employeecity: employeecity,
            employeestate: employeestate,
            employeezip: employeezip,
            employeestartdate: employeestartdate,
            employeeposition: employeeposition,
            employeepayrate: employeepayrate,
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
            <form  id="Patientform" onSubmit={this.handleSubmit}>
                <h2> Search Employees</h2>
                <table>
                    <tbody>
                    <tr>
                            <th>Employee ID</th>
                            <td>
                                <input type="text" name="employeeid" id="employeeid" value={this.state.employeeid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee First Name</th>
                            <td>
                            <input type="text" name="employeefirstname" id="employeefirstname" value={this.state.employeefirstname} onChange={this.handleChange} />
                            </td>

                        </tr>
                        <tr>
                            <th>Employee Last Name</th>
                            <td>
                            <input type="text" name="employeelastname" id="employeelastname" value={this.state.employeelastname} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Phone</th>
                            <td>
                            <input type="text" name="employeephone" id="employeephone" value={this.state.employeephone} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Email</th>
                            <td>
                            <input type="text" name="employeeemail" id="employeeemail" value={this.state.employeeemail} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Address</th>
                            <td>
                            <input type="text" name="employeeaddress" id="employeeaddress" value={this.state.employeeaddress} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee City</th>
                            <td>
                            <input type="text" name="employeecity" id="employeecity" value={this.state.employeecity} onChange={this.handleChange} />
                            </td>                            
                        </tr>
                        <tr>
                            <th>Employee State</th>
                            <td>
                            <input type="text" name="employeestate" id="employeestate" value={this.state.employeestate} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Zip</th>
                            <td>
                            <input type="text" name="employeezip" id="employeezip" value={this.state.employeezip} onChange={this.handleChange} />
                            </td>
                        </tr>                        
                        <tr>
                            <th>Employee Start Date</th>
                            <td>
                            <input type="date" name="employeestartdate" id="employeestartdate" value={this.state.employeestartdate} onChange={this.handleChange} />
                            </td>                          
                        </tr>
                        <tr>
                            <th>
                                Employee Position
                            </th>
                            <td>
                                <SelectList data={this.state.data} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Pay Rate</th>
                            <td>
                            <input type="text" name="employeepayrate" id="employeepayrate" value={this.state.employeepayrate} onChange={this.handleChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search Employee" />                
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

var EmployeeUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upemployeeid2: "",
            upemployeefirstname2: "",
            upemployeelastname2: "",  
            upemployeephone2: "",          
            upemployeeemail2: "",            
            upemployeeaddress2: "",
            upemployeecity2: "",
            upemployeestate2: "",
            upemployeezip2: "",             
            upemployeestartdate2:"",
            upemployeeenddate2:"",
            upemployeeposition2: "",
            upemployeepayrate2: "",
            updata: []
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    loadEmpPositions: function() {
        $.ajax({
            url: '/getemppositions',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({updata:data});
                console.log(updata);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadEmpPositions();
    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        
        var upemployeeid2 = upemployeeid.value;
        var upemployeefirstname2 = upemployeefirstname.value;
        var upemployeelastname2 = upemployeelastname.value;
        var upemployeephone2 = upemployeephone.value;
        var upemployeeemail2 = upemployeeemail.value;
        var upemployeeaddress2 = upemployeeaddress.value;
        var upemployeecity2 = upemployeecity.value;
        var upemployeestate2 = upemployeestate.value;
        var upemployeezip2 = upemployeezip.value;             
        var upemployeestartdate2 = upemployeestartdate.value;
        var upemployeeenddate2 = upemployeeenddate.value;
        var upemployeeposition2 = upemppos.value;
        var upemployeepayrate2 = upemployeepayrate.value;

        this.props.onUpdateSubmit({
            upemployeeid2,
            upemployeefirstname2,
            upemployeelastname2,    
            upemployeephone2,        
            upemployeeemail2,            
            upemployeeaddress2,
            upemployeecity2,
            upemployeestate2,
            upemployeezip2,
            upemployeestartdate2,
            upemployeeenddate2,
            upemployeeposition2,
            upemployeepayrate2,
        });
    },
    handleUpChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
                <div  id="PatientSearchBox">
                    <form  id="Patientform" onSubmit={this.handleUpSubmit}>
                    <h1>Update Employee</h1>
                        <table>
                            <tbody>
                            <tr>
                            
                            <td>
                                <input type="hidden" name="upemployeeid" id="upemployeeid" value={this.state.upemployeeid} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee First Name</th>
                            <td>
                            <input type="text" name="upemployeefirstname" id="upemployeefirstname" value={this.state.upemployeefirstname} onChange={this.handleUpChange} />
                            </td>

                        </tr>
                        <tr>
                            <th>Employee Last Name</th>
                            <td>
                            <input type="text" name="upemployeelastname" id="upemployeelastname" value={this.state.upemployeelastname} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Phone</th>
                            <td>
                            <input type="text" name="upemployeephone" id="upemployeephone" value={this.state.upemployeephone} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Email</th>
                            <td>
                            <input type="text" name="upemployeeemail" id="upemployeeemail" value={this.state.upemployeeemail} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Address</th>
                            <td>
                            <input type="text" name="upemployeeaddress" id="upemployeeaddress" value={this.state.upemployeeaddress} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee City</th>
                            <td>
                            <input type="text" name="upemployeecity" id="upemployeecity" value={this.state.upemployeecity} onChange={this.handleUpChange} />
                            </td>                            
                        </tr>
                        <tr>
                            <th>Employee State</th>
                            <td>
                            <input type="text" name="upemployeestate" id="upemployeestate" value={this.state.upemployeestate} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Zip</th>
                            <td>
                            <input type="text" name="upemployeezip" id="upemployeezip" value={this.state.upemployeezip} onChange={this.handleUpChange} />
                            </td>
                        </tr>                        
                        <tr>
                            <th>Employee Start Date</th>
                            <td>
                            <input type="date" name="upemployeestartdate" id="upemployeestartdate" value={this.state.upemployeestartdate} onChange={this.handleUpChange} />
                            </td>                          
                        </tr>
                        <tr>
                            <th>Employee End Date</th>
                            <td>
                            <input type="date" name="upemployeeenddate" id="upemployeeenddate" value={this.state.upemployeeenddate} onChange={this.handleUpChange} />
                            </td>                          
                        </tr>
                        <tr>
                            <th>
                                Employee Position
                            </th>
                            <td>
                                <SelectUpdateList data={this.state.updata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Pay Rate</th>
                            <td>
                            <input type="text" name="upemployeepayrate" id="upemployeepayrate" value={this.state.upemployeepayrate} onChange={this.handleUpChange} />
                            </td>
                        </tr>
</tbody>
                        </table><br />
                        <input type="hidden" name="upempkey" id="upempkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Employee" />
                    </form>
                </div>
        );
    }
});

var EmployeeList = React.createClass({
    render: function () {
        var employeeNodes = this.props.data.map(function (employee) {
            return (
                <Employee
                empkey={employee.empid}
                empid={employee.empid}
                empfname={employee.empfirstname}
                emplname={employee.emplastname}
                empphone={employee.empphone}
                empemail={employee.empemail}
                empaddr={employee.empaddress}
                empcity={employee.empcity}                    
                empstate={employee.empstate}
                empzip={employee.empzip}
                empsd={new Intl.DateTimeFormat("en-US", {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit'
                }).format(new Date(employee.empstartdate))}  
                emped={new Intl.DateTimeFormat("en-US", {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit'
                }).format(new Date(employee.empenddate))}                    
                emppos={employee.positionID}
                empsalary={employee.emppayrate}
                >
                </Employee>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {employeeNodes}
            </tbody>
        );
    }
});

var Employee = React.createClass({
    getInitialState: function () {
        return {
            upempkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupempkey = this.props.empkey;
        
        this.loadSingleEmp(theupempkey);
    },
    loadSingleEmp: function (theupempkey) {
        
        $.ajax({
            url: '/getsingleemp',
            data: {
                'upempkey': theupempkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log("SINGLE DATA: ",this.state.singledata);
                var populateEmp = this.state.singledata.map(function (employee) {
                    upemployeeid.value = employee.empid;                                       
                    upemployeefirstname.value = employee.empfirstname;
                    upemployeelastname.value = employee.emplastname;
                    upemployeephone.value = employee.empphone;
                    upemployeeemail.value = employee.empemail; 
                    upemployeeaddress.value = employee.empaddress;
                    upemployeecity.value = employee.empcity;
                    upemployeestate.value = employee.empstate;
                    upemployeezip.value = employee.empzip;
                    upemployeestartdate.value = new Date(employee.empstartdate).toISOString().slice(0,10);
                    upemployeeenddate.value = new Date(employee.empenddate).toISOString().slice(0,10);
                    upemployeepayrate.value = employee.emppayrate;
                    upemppos.value = employee.positionID;
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        
    },

    render: function () {
        
        if( this.props.emppos == 1){
            var position = 'Manager'
        } else if (this.props.emppos == 2){
            var position = 'Doctor'
        }else{
            var position = 'General Employee'
        }

        return (

            <tr>
                            <td>
                                {this.props.empid}
                            </td>
                            <td>
                                {this.props.empfname}
                            </td>
                            <td>
                                {this.props.emplname}
                            </td>
                            <td>
                                {this.props.empphone}
                            </td>
                            <td>
                                {this.props.empemail}
                            </td>
                            <td>
                                {this.props.empaddr}
                            </td>
                            <td>
                                {this.props.empcity}
                            </td>
                            <td>
                                {this.props.empstate}
                            </td>
                            <td>
                                {this.props.empzip}
                            </td>
                            <td>
                                {this.props.empsd}
                            </td>
                            <td>
                                {this.props.emped}
                            </td>
                            <td>
                                {position}
                            </td>
                            <td>
                                {this.props.empsalary}
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

var SelectList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (empPosition) {
            return (
                <option
                    key={empPosition.positionID}
                    value={empPosition.positionID}
                >
                    {empPosition.positionname}
                </option>
            );
        });
        return (
            <select name="emppos" id="emppos">
                {optionNodes}
            </select>
        );
    }
});


var SelectUpdateList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (empPosition) {
            return (
                <option
                    key={empPosition.positionID}
                    value={empPosition.positionID}
                >
                    {empPosition.positionname}
                </option>
            );
        });
        return (
            <select name="upemppos" id="upemppos">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <EmployeeBox />,
    document.getElementById('content')
);