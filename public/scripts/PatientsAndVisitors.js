var LoginBox = React.createClass({
    getInitialState: function () {
        return {
            data: []
        };
    },
    handleLogin: function (logininfo) {

        $.ajax({
            url: '/loginpatient/',
            dataType: 'json',
            type: 'POST',
            data: logininfo,
            success: function (data) {
                this.setState({ data: data });
                console.log(data);
                if (typeof data.redirect == 'string') {
                    window.location = data.redirect;
                }
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        return (
            <div>
                
                <LoginForm onLoginSubmit={this.handleLogin} />
                <br />
                
            </div>
        );
    }
});

var LoginForm = React.createClass({
    getInitialState: function () {
        return {
            patientemail: "",
            patientpwd: "",

        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
   
    handleSubmit: function (e) {
        e.preventDefault();

        var patientpwd = this.state.patientpwd.trim();
        var patientemail = this.state.patientemail.trim();
        
      
        
        this.props.onLoginSubmit({
            patientpwd: patientpwd,
            patientemail: patientemail, 
        });
        
    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
            
            <div id="patientlogincontainer">
                <h1>Patient Portal</h1>
                <div id="theform">
                    <form onSubmit={this.handleSubmit}>
                    <h1 id="loginheader">Patient Login</h1>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Patient Email </th>
                                    <td>
                                        <input name="patientemail" id="patientemail" value={this.state.patientemail} onChange={this.handleChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Patient Password </th>
                                    <td>
                                        <input type="password" name="patientpwd" id="patientpwd" value={this.state.patientpwd} onChange={this.handleChange} />
                                    </td>
                                </tr>
                               
                            </tbody>
                        </table><br />
                        <input type="submit" value="Login" />
                    </form>
                </div>
                <div id="clrbtn">
                <a href="insertpatient.html" id="addpatlogin">Create Login</a>
                    <form onSubmit={this.getInitialState}>
                        <input type="submit" value="Clear Form" />
                    </form>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <LoginBox />,
    document.getElementById('content')
);

