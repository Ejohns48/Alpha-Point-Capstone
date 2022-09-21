var EmployeeBox = React.createClass({
    getInitialState: function () {
        return { data: [], data2: [] ,viewthepage: 0};
    },
    loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedin',
            dataType: 'json',
            cache: false,
            success: function (datalog) {
                this.setState({ data2: datalog });                
                this.setState({ viewthepage: this.state.data2[0].positionID }); 
                console.log("Logged in:" + this.state.viewthepage);
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
    componentDidMount: function () {
        this.loadAllowLogin();
        if (this.state.viewthepage != 0) {
            this.loadEmployeesFromServer();
        }       
    },
    render: function () {
        if (this.state.viewthepage != 1) {
            return (
                <div className="accessMessage">
                    <h1>Access Denied</h1>
                    <p><strong>Please contact your system administrator for privileges.</strong></p>
                </div>
            );
        } else {
        return (
            <div>
                
                <Employeeform2 id="PatientList" onEmployeeSubmit={this.loadEmployeesFromServer} />
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
                                <th>Position</th>
                                <th>Salary</th>
                            </tr>
                         </thead>
                        <EmployeeList data={this.state.data} />
                    </table>
                
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
            <div id="PatientSearchBox">
            <form id="Patientform" onSubmit={this.handleSubmit}>
                <h2>Search Employees</h2>
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
                <input type="submit" value="Search Employees" />
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
                    key={employee.empid}
                    empid={employee.empid}
                    empfname={employee.empfirstname}
                    emplname={employee.emplastname}
                    empphone={employee.empphone}
                    empemail={employee.empemail}
                    empaddr={employee.empaddress}
                    empcity={employee.empcity}                    
                    empstate={employee.empstate}
                    empzip={employee.empzip}
                    empsd={employee.empstartdate}                    
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
                            {new Intl.DateTimeFormat("en-US", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: '2-digit'
                                }).format(new Date(this.props.empsd))}
                            </td>
                            <td>
                                {position}
                            </td>
                            <td>
                                {this.props.empsalary}
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

ReactDOM.render(
    <EmployeeBox />,
    document.getElementById('content')
);