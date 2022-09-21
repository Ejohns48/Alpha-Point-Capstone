var ApptDetailsBox = React.createClass({

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
    handleApptDetailsSubmit: function (apptdetails) {
    
        $.ajax({
            url: '/insertapptdetails',
            dataType: 'json',
            type: 'POST',
            data: apptdetails,
            success: function(data) {
                this.setState({data:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        document.getElementById('apptDetailsSuccessMsg').innerHTML = 'Appointment Details Added';
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
                <h2>Appointment Details Information</h2>
                <ApptDetailsform2 onApptDetailsSubmit = {this.handleApptDetailsSubmit} />
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

var ApptDetailsform2 = React.createClass({
    getInitialState: function () {
        return {
            
            drnotes: "",
            patientsymp: "",
            medpresc: "",
            data: [],
        };
    },

    loadAppts: function() {
        $.ajax({
            url: '/getapptidsfordetails',
            dataType: 'json',
            cache: false,
            success: function(data) {
                console.log("SUCCESS: ", data)
                this.setState({data:data});
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

        var appointment = appts.value.split('-')[0].trim();
        var drnotes = this.state.drnotes.trim();
        var patientsymp = this.state.patientsymp.trim();
        var medpresc = this.state.medpresc.trim();

        if (!appointment){
            document.getElementById('insApptDetailsEmptyMsg').innerHTML = 'Select An Appointment Id'; 
            setTimeout(() => {
                document.getElementById('insApptDetailsEmptyMsg').innerHTML = '';
            }, 1500);   
            return;        
        }
        else {

            this.props.onApptDetailsSubmit({
                appointment: appointment,
                drnotes: drnotes,
                patientsymp: patientsymp,
                medpresc: medpresc,
                
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
                            <th>
                                Appointment(ID---Date)
                            </th>
                            <td>
                                <SelectList data={this.state.data} />
                            </td>
                        </tr>

                        <tr>
                            <th>Doctors Notes</th>
                            <td>
                <TextInput
                    value={this.state.drnotes}
                    uniqueName="drnotes"
                    textArea={true}
                    required={false}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'drnotes')} />
                            </td>
                        </tr>


                        <tr>
                            <th>Patient Symptoms</th>
                            <td>
                <TextInput
                    value={this.state.patientsymp}
                    uniqueName="patientsymp"
                    textArea={true}
                    required={false} 
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'patientsymp')} />
                            </td>
                        </tr>
                        <tr>
                            <th>Prescribed Medications</th>
                            <td>
                <TextInput
                    value={this.state.medpresc}
                    uniqueName="medpresc"
                    textArea={true}
                    required={false}
                    validate={this.validateEmail}
                    onChange={this.setValue.bind(this, 'medpresc')} />
                            </td>
                        </tr>
                            
                    </tbody>
                </table>
                <p id='insApptDetailsSuccessMsg' className="add-appt-details" ></p>
                <p id='insApptDetailsEmptyMsg' className="add-appt-details" ></p>
                <input type = "submit" value="Add Appointment Details" />
               
            </form>
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
                >{appts.appointmentid}---{new Intl.DateTimeFormat("en-US", 
                        {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }).format(new Date(appts.appointmentdate))
                    }
                </option>
            );
        });
        return (
            <select name="appts" id="appts">
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
    <ApptDetailsBox />,
    document.getElementById('content')
);
