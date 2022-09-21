var ApptBox = React.createClass({

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
    handleApptSubmit: function (appt) {
    
        $.ajax({
            url: '/insertappt',
            dataType: 'json',
            type: 'POST',
            data: appt,
            success: function(data) {
                this.setState({data:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        document.getElementById('insApptSuccessMsg').innerHTML = 'Appointment Was Added';
        setTimeout(() => {
            window.location.reload(true);
        }, 1500);
    },
    componentDidMount: function () {
        this.loadAllowLogin();    
    },
    render: function () {
                if (this.state.viewthepage == 1 || this.state.viewthepage == 2) {
                    return (
                        <div className="ApptBox">
                            <h2>New Appointment Information</h2>
                            <Apptform2 onApptSubmit = {this.handleApptSubmit} />
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

var Apptform2 = React.createClass({
    getInitialState: function () {
        return {
            appointmentdate: "",
            appointmenttime: "",
            dataemps: [],
            datapats: [],
        };
    },

    loadEmps: function() {
        $.ajax({
            url: '/getdoctors',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({dataemps:data});
            }.bind(this),
            
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadPatients: function() {
        $.ajax({
            url: '/getpatients',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({datapats:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadEmps();
        this.loadPatients();
    },

    handleSubmit: function (e) {

        e.preventDefault();

        var appointmentdate = this.state.appointmentdate;
        var empid = empname.value;
        var patientid = patname.value;
        var appointmenttime = this.state.appttime;

        if (!appointmentdate){
            document.getElementById('insApptEmptyMsg').innerHTML = 'Fill Out Appointment Date'; 
            setTimeout(() => {
                document.getElementById('insApptEmptyMsg').innerHTML = '';
            }, 1500);   
            return;        
        }
        if (!appointmenttime){
            document.getElementById('insApptEmptyMsg').innerHTML = 'Fill Out Appointment Time'; 
            setTimeout(() => {
                document.getElementById('insApptEmptyMsg').innerHTML = '';
            }, 1500);   
            return;        
        }
        if (!empid){
            document.getElementById('insApptEmptyMsg').innerHTML = 'Select A Doctor'; 
            setTimeout(() => {
                document.getElementById('insApptEmptyMsg').innerHTML = '';
            }, 1500);   
            return;        
        }
        if (!patientid){
            document.getElementById('insApptEmptyMsg').innerHTML = 'Select A Patient'; 
            setTimeout(() => {
                document.getElementById('insApptEmptyMsg').innerHTML = '';
            }, 1500);   
            return;        
        }
        else {
            this.props.onApptSubmit({
                appointmentdate: appointmentdate,
                empid: empid,
                patientid: patientid,
                appointmenttime: appointmenttime,
            });
        }
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
                            <th>Appointment Date</th>
                            <td>
                <TextInput
                    inputType="date"
                    value={this.state.appointmentdate}
                    uniqueName="appointmentdate"
                    textArea={false}
                    required={true}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'appointmentdate')}
                    errorMessage="Appointment Date is invalid"
                    emptyMessage="Appointment Date is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Time</th>        
                            <td>
                                <input 
                                type="time" 
                                list="hoursAvail"
                                defaultValue="08:00"
                                value={this.state.appttime}
                                name="appttime" 
                                uniqueName="appttime"   
                                id="appttime"   
                                onChange={this.setValue.bind(this, 'appttime')}                         
                                />
                                <datalist id="hoursAvail">
                                    <option value="08:00" />
                                    <option value="09:00" />
                                    <option value="10:00" />
                                    <option value="11:00" />
                                    <option value="12:00" />
                                    <option value="13:00" />
                                    <option value="14:00" />
                                    <option value="15:00" />
                                    <option value="16:00" />
                                </datalist>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Doctor Name
                            </th>
                            <td>
                                <SelectList data={this.state.dataemps} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Patient Name
                            </th>
                            <td>
                                <SelectList2 data={this.state.datapats} />
                            </td>
                        </tr>
                            
                    </tbody>
                </table>
                <p id='insApptSuccessMsg' className="add-appt" ></p>
                <p id='insApptEmptyMsg' className="add-appt" ></p>
                <input type = "submit" value="Create Appointment" />
               
            </form>
        );
    }
});

var SelectList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (empName) {
            return (
                <option
                    key={empName.empid}
                    value={empName.empid}
                >
                    {empName.empfirstname} {empName.emplastname}
                </option>
            );
        });
        return (
            <select name="empname" id="empname" >
                <option></option>
                {optionNodes}
            </select>
        );
    }
});


var SelectList2 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (patName) {
            return (
                <option
                    key={patName.patientid}
                    value={patName.patientid}
                >   
                    {patName.patientfirstname} {patName.patientlastname}
                </option>
            );
        });
        return (
            <select name="patname" id="patname">
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
    <ApptBox />,
    document.getElementById('content')
);
