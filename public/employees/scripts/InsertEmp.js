var EmployeeBox = React.createClass({

    getInitialState: function () {
        return { viewthepage: 0 };   
          
    },
    loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedin',
            dataType: 'json',
            cache: false,
            success: function (datalog) {
                this.setState({ data: datalog });                
                this.setState({ viewthepage: this.state.data[0].positionID });  
                
                 
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleEmployeeSubmit: function (employee) {
    
        $.ajax({
            url: '/insertemp',
            dataType: 'json',
            type: 'POST',
            data: employee,
            success: function(data) {
                this.setState({data:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        document.getElementById('insEmpSuccessMsg').innerHTML = 'Employee Was Added';
        setTimeout(() => {
            window.location.reload(true);
        }, 1500);
    },

    componentDidMount: function () {
        this.loadAllowLogin();
    },
    render: function () {
        if (this.state.viewthepage != 1) {
            return (
                <div className="accessMessage">
                <h1>Access Denied</h1>
                <p><strong>Please contact your system administrator or <a href="index.html">Log In Here</a></strong></p>
            
            </div>
            );
        } else {
        return (
            <div className="EmployeeBox">
                <h1>New Employee Information</h1>
                <Employeeform2 onEmployeeSubmit = {this.handleEmployeeSubmit} />
            </div>
        );
        }
    }
});



var Employeeform2 = React.createClass({
    getInitialState: function () {
        return {
            employeefirstname: "",
            employeelastname: "",  
            employeephone: "",          
            employeeemail: "",            
            employeeaddress: "",
            employeecity: "",
            employeestate: "",
            employeezip: "",             
            employeestartdate:"",
            employeeenddate: "",
            employeeposition: "",
            employeepayrate: "",
            employeepwd: "",
            employeepwd2: "",
            data: []
        };
    },
    
    loadEmpPositions: function() {
        $.ajax({
            url: '/getemppositions',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    
    componentDidMount: function () {
        if (this.state.viewthepage != 0) {
        this.loadEmpPositions();
        }
    },






    handleSubmit: function (e) {

        e.preventDefault();

        var employeefirstname = this.state.employeefirstname.trim();
        var employeelastname = this.state.employeelastname.trim();
        var employeephone = this.state.employeephone.trim();        
        var employeeemail = this.state.employeeemail;
        var employeeaddress = this.state.employeeaddress.trim();
        var employeecity = this.state.employeecity.trim();
        var employeestate = this.state.employeestate.trim();
        var employeezip = this.state.employeezip.trim();
        var employeestartdate = this.state.employeestartdate.trim();        
        var employeeenddate = this.state.employeeenddate.trim();
        var employeeposition = emppos.value;
        var employeepayrate = this.state.employeepayrate.trim();
        var employeepwd = this.state.employeepwd.trim();
        var employeepwd2 = this.state.employeepwd2.trim();
        
        if (!employeeemail){
            document.getElementById('insEmpEmptyMsg').innerHTML = 'Email Required'; 
            setTimeout(() => {
                document.getElementById('insEmpEmptyMsg').innerHTML = '';
            }, 1500);   
            return; 
        }
        if (!this.validateEmail(employeeemail)) {
            document.getElementById('insEmpEmptyMsg').innerHTML = 'Email Invalid'; 
            setTimeout(() => {
                document.getElementById('insEmpEmptyMsg').innerHTML = '';
            }, 1500);   
            return; 
        }
        if (!employeestartdate) {
            document.getElementById('insEmpEmptyMsg').innerHTML = 'Start Date Required'; 
            setTimeout(() => {
                document.getElementById('insEmpEmptyMsg').innerHTML = '';
            }, 1500);   
            return; 
        }        
        if (!employeeposition) {
            document.getElementById('insEmpEmptyMsg').innerHTML = 'Position Required'; 
            setTimeout(() => {
                document.getElementById('insEmpEmptyMsg').innerHTML = '';
            }, 1500);   
            return; 
        }
        if (employeepwd != employeepwd2) {
            document.getElementById('insEmpEmptyMsg').innerHTML = 'Passwords Do Not Match'; 
            setTimeout(() => {
                document.getElementById('insEmpEmptyMsg').innerHTML = '';
            }, 1500);   
            return; 
        }
        else {
            this.props.onEmployeeSubmit({
                employeefirstname: employeefirstname,
                employeelastname: employeelastname,    
                employeephone: employeephone,        
                employeeemail: employeeemail,            
                employeeaddress: employeeaddress,
                employeecity: employeecity,
                employeestate: employeestate,
                employeezip: employeezip,
                employeestartdate: employeestartdate,
                employeeenddate: employeeenddate,
                employeeposition: employeeposition,
                employeepayrate: employeepayrate,
                employeepwd: employeepwd,

            });
        }
    },

    validateEmail: function (value) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    },
    commonValidate: function () {
        return true;
    },
    setValue: function (field, event) {
        var object = {};
        object[field] = event.target.value;
        this.setState(object);
    },
    render: function () {


        return (
            <form onSubmit={this.handleSubmit}>
                
                <table>
                    <tbody>
                        <tr>
                            <th>Employee First Name</th>
                            <td>
                <TextInput
                    value={this.state.employeefirstname}
                    uniqueName="employeefirstname"
                    textArea={false}
                    required={true}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'employeefirstname')}
                    errorMessage="First Name Invalid"
                    emptyMessage="First Name Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Last Name</th>
                            <td>
                <TextInput
                    value={this.state.employeelastname}
                    uniqueName="employeelastname"
                    textArea={false}
                    required={true} 
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'employeelastname')}
                    errorMessage="Last Name Invalid"
                    emptyMessage="Last Name Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Phone</th>
                            <td>
                <TextInput
                    inputType="tel"                  
                    value={this.state.employeephone}
                    uniqueName="employeephone"
                    textArea={false}
                    required={true} 
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'employeephone')}                    
                    emptyMessage="Phone Number Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Email</th>
                            <td>
                <TextInput
                    value={this.state.employeeemail}
                    uniqueName="employeeemail"
                    textArea={false}
                    required={true}
                    validate={this.validateEmail}
                    onChange={this.setValue.bind(this, 'employeeemail')} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Address</th>
                            <td>
                <TextInput
                    value={this.state.employeeaddress}
                    uniqueName="employeeaddress"
                    textArea={false}
                    required={false}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'employeeaddress')}
                    errorMessage="Address Invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee City</th>
                            <td>
                <TextInput
                    value={this.state.employeecity}
                    uniqueName="employeecity"
                    textArea={false}
                    required={false}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'employeecity')}
                    errorMessage="City Invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee State</th>
                            <td>
                <TextInput
                    value={this.state.employeestate}
                    uniqueName="employeestate"
                    textArea={false}
                    required={false}                   
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'employeestate')}
                    errorMessage="State Invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Zip</th>
                            <td>

                <TextInput
                    value={this.state.employeezip}
                    uniqueName="employeezip"
                    textArea={false}
                    required={false}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'employeezip')}
                    errorMessage=""
                    emptyMessage="Zip Code Invalid" />
                            </td>
                        </tr>                        
                        <tr>
                            <th>Employee Start Date</th>
                            <td>

                <TextInput
                    inputType="date"
                    value={this.state.employeestartdate}
                    uniqueName="employeestartdate"
                    pattern="\d{4}-\d{2}-\d{2}"
                    textArea={false}
                    required={false}
                    validate={this.validateDollars}
                    onChange={this.setValue.bind(this, 'employeestartdate')}
                    />
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

                <TextInput
                    value={this.state.employeepayrate}
                    uniqueName="employeepayrate"
                    textArea={false}
                    required={false}
                    validate={this.validateDollars}
                    onChange={this.setValue.bind(this, 'employeepayrate')}
                    />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Password</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.employeepwd}
                                    uniqueName="employeepwd"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'employeepwd')}
                                    errorMessage="Password Invalid"
                                    emptyMessage="Password Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Confirm Password</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.employeepwd2}
                                    uniqueName="employeepwd2"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'employeepwd2')}
                                    errorMessage="Password Invalid"
                                    emptyMessage="Password Required" />
                            </td>
                        </tr>                 
                    </tbody>
                </table>
                <p id='insEmpSuccessMsg' className="add-emp" ></p>
                <p id='insEmpEmptyMsg' className="add-emp" ></p>
                <input type = "submit" value="Add Employee"/>
               
            </form>
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
                <option></option>
                {optionNodes}
            </select>
        );
    }
});

var InputError = React.createClass({
    getInitialState: function () {
        return {
            message: 'Input is invalid'
        };
    },
    render: function () {
        var errorClass = classNames(this.props.className, {
            'error_container': true,
            'visible': this.props.visible,
            'invisible': !this.props.visible
        });

        return (
                <td> {this.props.errorMessage} </td>
        )
    }
});

var TextInput = React.createClass({
    getInitialState: function () {
        return {
            isEmpty: true,
            value: null,
            valid: false,
            errorMessage: "",
            errorVisible: false
        };
    },

    handleChange: function (event) {
        this.validation(event.target.value);

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },

    validation: function (value, valid) {
        if (typeof valid === 'undefined') {
            valid = true;
        }

        var message = "";
        var errorVisible = false;

        if (!valid) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }
        else if (this.props.required && jQuery.isEmptyObject(value)) {
            message = this.props.emptyMessage;
            valid = false;
            errorVisible = true;
        }
        else if (value.length < this.props.minCharacters) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }

        this.setState({
            value: value,
            isEmpty: jQuery.isEmptyObject(value),
            valid: valid,
            errorMessage: message,
            errorVisible: errorVisible
        });

    },

    handleBlur: function (event) {
        var valid = this.props.validate(event.target.value);
        this.validation(event.target.value, valid);
    },
    render: function () {
        if (this.props.textArea) {
            return (
                <div className={this.props.uniqueName}>
                    <textarea
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        } else {
            return (
                <div className={this.props.uniqueName}>
                    <input
                        type={this.props.inputType}
                        name={this.props.uniqueName}
                        id={this.props.uniqueName}
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        }
    }
});

ReactDOM.render(
    <EmployeeBox />,
    document.getElementById('content')
);
