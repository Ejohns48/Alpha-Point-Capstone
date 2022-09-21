var PatientBox = React.createClass({

    getInitialState: function () {
        return { data:[],viewthepage: 0 };   
          
    },
    loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedin',
            dataType: 'json',
            cache: false,
            success: function (datalog) {
                this.setState({ data: datalog });                
                this.setState({ viewthepage: this.state.data[0].positionID });  
                console.log("DATA: ",datalog); 
                console.log("VIEW THE PAGE: ",this.state.viewthepage);  
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    
    handlePatientSubmit: function (patient) {
    
        $.ajax({
            url: '/insertpatient',
            dataType: 'json',
            type: 'POST',
            data: patient,
            success: function(data) {
                this.setState({data:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        document.getElementById('insPatSuccessMsg').innerHTML = 'Patient Was Added';
        setTimeout(() => {
            window.location.reload(true);
        }, 1500);
    },
    componentDidMount: function () {
        this.loadAllowLogin();        
    },
    render: function () {
                if (this.state.viewthepage == 1 || this.state.viewthepage ==2) {
            return (
                <div className="PatientBox">
                    <h2>New Patient Information</h2>
                    <Patientform2 onPatientSubmit = {this.handlePatientSubmit} />
                </div>
            );
        } else {
            return (
                <div className="accessMessage">
                <h1>Access Denied</h1>
                <p><strong>Please contact your system administrator or <a href="index.html">Log In Here</a></strong></p>
            
            </div>
                
            );
        }
    }
});

var Patientform2 = React.createClass({
    getInitialState: function () {
        return {
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
            patientpwd: "",
            patientpwd2: ""
        };
    },

    handleSubmit: function (e) {

        e.preventDefault();

        var patientfirstname = this.state.patientfirstname.trim();
        var patientlastname = this.state.patientlastname.trim();
        var patientdob = this.state.patientdob.trim();
        var patientemail = this.state.patientemail;
        var patientphone = this.state.patientphone.trim();
        var patientaddress = this.state.patientaddress.trim();
        var patientcity = this.state.patientcity.trim();
        var patientstate = this.state.patientstate.trim();
        var patientzip = this.state.patientzip.trim();
        var patientinsurance = this.state.patientinsurance.trim();
        var patientpwd = this.state.patientpwd.trim();
        var patientpwd2 = this.state.patientpwd2.trim();

        if(!this.validateEmail(patientemail)) {
            console.log("Bad Email!!!" + this.validateEmail(patientemail));
            return;
        }

        if (patientpwd2 != patientpwd) {
            console.log("Passwords do not match!!");
            alert("Passwords do not match!!");
            return;
        }

        if(!patientfirstname || !patientlastname || !patientdob || !patientphone) {
            console.log("Required Field Missing");
            return;
        }

        this.props.onPatientSubmit({
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
            patientpwd: patientpwd,
        });

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
                            <th>Patient First Name</th>
                            <td>
                <TextInput
                    value={this.state.patientfirstname}
                    uniqueName="patientfirstname"
                    textArea={false}
                    required={true}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'patientfirstname')}
                    errorMessage="Patient First Name is invalid"
                    emptyMessage="Patient First Name is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Last Name</th>
                            <td>
                <TextInput
                    value={this.state.patientlastname}
                    uniqueName="patientlastname"
                    textArea={false}
                    required={true} 
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'patientlastname')}
                    errorMessage="Patient Last Name Is Invalid"
                    emptyMessage="Patient Last Name Is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient DOB</th>
                            <td>
                <TextInput
                    inputType="date"
                    value={this.state.patientdob}
                    uniqueName="patientdob"
                    textArea={false}
                    required={false} 
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'patientdob')}
                    errorMessage="Patient DOB Is Invalid"
                    emptyMessage="Patient DOB Is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Email</th>
                            <td>
                <TextInput
                    value={this.state.patientemail}
                    uniqueName="patientemail"
                    textArea={false}
                    required={false}
                    validate={this.validateEmail}
                    onChange={this.setValue.bind(this, 'patientemail')}
                    errorMessage="Patient Email Is Invalid"
                    emptyMessage="Patient Email Is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Phone</th>
                            <td>
                <TextInput
                    value={this.state.patientphone}
                    uniqueName="patientphone"
                    textArea={false}
                    required={false}
                    minCharacters={6}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'patientphone')}
                    errorMessage="Patient Phone Is Invalid"
                    emptyMessage="Patient Phone Is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Address</th>
                            <td>
                <TextInput
                    value={this.state.patientaddress}
                    uniqueName="patientaddress"
                    textArea={false}
                    required={false}
                    minCharacters={6}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'patientaddress')}
                    errorMessage="Patient Address Is Invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient City</th>
                            <td>
                <TextInput
                    value={this.state.patientcity}
                    uniqueName="patientcity"
                    textArea={false}
                    required={false}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'patientcity')}
                    errorMessage="Patient City Is Invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient State</th>
                            <td>
                <TextInput
                    value={this.state.patientstate}
                    uniqueName="patientstate"
                    textArea={false}
                    required={false}                   
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'patientstate')}
                    errorMessage="Patient State Is Invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Zip</th>
                            <td>

                <TextInput
                    value={this.state.patientzip}
                    uniqueName="patientzip"
                    textArea={false}
                    required={false}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'patientzip')}
                    errorMessage=""
                    emptyMessage="Patient Zip Is Invalid" />
                            </td>
                        </tr>                        
                        <tr>
                            <th>Patient Insurance</th>
                            <td>

                <TextInput
                    value={this.state.patientinsurance}
                    uniqueName="patientinsurance"
                    textArea={false}
                    required={false}
                    validate={this.validateDollars}
                    onChange={this.setValue.bind(this, 'patientinsurance')}
                    />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Password</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.patientpwd}
                                    uniqueName="patientpwd"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'patientpwd')}
                                    errorMessage="Invalid Password"
                                    emptyMessage="Password is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Confirm Password</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.patientpwd2}
                                    uniqueName="patientpwd2"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'patientpwd2')}
                                    errorMessage="Invalid Password"
                                    emptyMessage="Password is Required" />
                            </td>
                        </tr>                 
                    </tbody>
                </table>
                <p id='insPatSuccessMsg' className="add-pat" ></p>
                <p id='insPatSuccessMsg' className="add-pat" ></p>
                <input type = "submit" value="Add Patient" />
               
            </form>
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
    <PatientBox />,
    document.getElementById('content')
);
