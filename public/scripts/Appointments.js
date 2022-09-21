var ApptBox = React.createClass({
    handleApptSubmit: function (appt) {
    
        $.ajax({
            url: '/insertapptpatient',
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
    },
    render: function () {
        return (
            <div className="ApptBox">
                        <div id="apptinfo">
                            <p>Appointments will be one hour in length.</p>
                            <br />
                            <p>Appointment times are from <strong>8 A.M. to 4 P.M. Mon-Fri</strong></p> 
                            <p></p> 
                            <p></p> 
                            <p></p> 
                        </div>
                        <div id="apptform2">
                <h2>Request An Appointment<div id="confirmsubmit"></div></h2>
                <Apptform2 onApptSubmit = {this.handleApptSubmit} />
                </div>

            </div>
        );
    }
});

var Apptform2 = React.createClass({
    getInitialState: function () {
        return {
            dataemps: [],
            appointmentdate2: "",
            appointmenttime2: "",
        };
    },

    loadEmps: function() {
        $.ajax({
            url: '/getdoctors',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({dataemps:data});
                console.log(dataemps);
            }.bind(this),
            
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function(){
        this.loadEmps();
    },
    handleSubmit: function (e) {
        e.preventDefault();

        var empid = empname.value;
        var appointmentdate2 = this.state.appointmentdate.trim();
        var appointmenttime2 = this.state.appttime.trim();

        // if(!appointmentdate || !empid || !patientid) {
        //     console.log("Required Field Missing");
        //     return;
        // }
        alert('Your Request Has Been Submitted');

        this.props.onApptSubmit({
            appointmentdate2: appointmentdate2,
            empid: empid,
            appointmenttime2: appointmenttime2,
        });
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
                    emptyMessage="Select A Date" />
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

                        {/* <tr>
                            <th>Appointment Time</th>
                            <td>
                <TextInput
                
                    inputType="time"
                    list="hours"
                    min="08:00" 
                    max="18:00"
                    value={this.state.appttime}
                    uniqueName="appttime"
                    textArea={false}
                    required={true}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'appttime')}
                    errorMessage="Appointment Time is invalid"
                    emptyMessage="Select A Time" />
                            </td>
                        </tr> */}
                        <tr>
                            <th>
                                Select A Doctor
                            </th>
                            <td>
                                <SelectList data={this.state.dataemps} />
                            </td>
                        </tr>

                            
                    </tbody>
                </table>
                <input type = "submit" value="Submit Request" />
               
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
            <select name="empname" id="empname">
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
