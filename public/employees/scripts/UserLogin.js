var LoginBox = React.createClass({
    getInitialState: function () {
        return {
            data: []
        };
    },
    handleLogin: function (logininfo) {

        $.ajax({
            url: '/loginemp/',
            dataType: 'json',
            type: 'POST',
            data: logininfo,
            success: function (data) {
                this.setState({ data: data });
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
            empemail: "",
            emppwd: "",

        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
   
    handleSubmit: function (e) {
        e.preventDefault();

        var emppwd = this.state.emppwd.trim();
        var empemail = this.state.empemail.trim();
      
        this.props.onLoginSubmit({
            emppwd: emppwd,
            empemail: empemail
        });

    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
            <div id="employeelogincontainer">
                <div id="theform">
                    <form onSubmit={this.handleSubmit}>
                        <h1 id="loginheader">Employee Login</h1>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Employee Email</th>
                                    <td>
                                        <input name="empemail" id="empemail" value={this.state.empemail} onChange={this.handleChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Employee Password</th>
                                    <td>
                                        <input type = "password" name="emppwd" id="emppwd" value={this.state.emppwd} onChange={this.handleChange} />
                                    </td>
                                </tr>
                               
                            </tbody>
                        </table><br />
                        <input type="submit" value="Enter Login" />
                    </form>
                </div>
                <div  id="clrbtnemp">
                    
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

