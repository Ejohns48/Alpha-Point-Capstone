var OrderBox = React.createClass({

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
    handleOrderSubmit: function (order) {
    
        $.ajax({
            url: '/insertorder',
            dataType: 'json',
            type: 'POST',
            data: order,
            success: function(data) {
                this.setState({data:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        document.getElementById('insOrderSuccessMsg').innerHTML = 'Order Was Added';
        setTimeout(() => {
            window.location.reload(true);
        }, 1500);
    },
    componentDidMount: function () {
        this.loadAllowLogin();
    },
    render: function () {
                if (this.state.viewthepage == 0) {
            return (
                <div className="accessMessage">
                <h1>Access Denied</h1>
                <p><strong>Please contact your system administrator or <a href="index.html">Log In Here</a></strong></p>
            
            </div>
            );
        } else {
        return (
            <div className="OrderBox">
                <h2>New Order Information</h2>
                <Orderform2 onOrderSubmit = {this.handleOrderSubmit} />
            </div>
        );
        }
    }
});

var Orderform2 = React.createClass({
    getInitialState: function () {
        return {
            orderdate: "",
            orderpurchaseid: "",
            ordertotal: "",
            orderdiscount: "",
        };
    },

    handleSubmit: function (e) {

        e.preventDefault();

        var orderdate2 = this.state.orderdate.trim();
        var orderpurchaseid2 = this.state.orderpurchaseid.trim();
        var ordertotal2 = this.state.ordertotal.trim();
        var orderdiscount2 = this.state.orderdiscount.trim();

        if(!orderdate2) {
            document.getElementById('insOrderEmptyMsg').innerHTML = 'Select Order Date'; 
            setTimeout(() => {
                document.getElementById('insOrderEmptyMsg').innerHTML = '';
            }, 1500);   
            return; 
        }
        else {
            this.props.onOrderSubmit({
                orderdate2: orderdate2,
                orderpurchaseid2: orderpurchaseid2,
                ordertotal2: ordertotal2,
                orderdiscount2: orderdiscount2,
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
                            <th>Order Date</th>
                            <td>
                <TextInput
                    inputType="date"
                    value={this.state.orderdate}
                    uniqueName="orderdate"
                    textArea={false}
                    required={true}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'orderdate')}
                    errorMessage="Order Date is invalid"
                    emptyMessage="Order Date is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Purchase ID</th>
                            <td>
                <TextInput
                    inputType="text"
                    value={this.state.orderpurchaseid}
                    uniqueName="orderpurchaseid"
                    textArea={false}
                    required={true}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'orderpurchaseid')}
                    errorMessage="Order Purchase ID is invalid"
                    emptyMessage="Order Purchase ID is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Total</th>
                            <td>
                <TextInput
                    value={this.state.ordertotal}
                    uniqueName="ordertotal"
                    textArea={false}
                    required={false}
                    validate={this.validateEmail}
                    onChange={this.setValue.bind(this, 'ordertotal')} />
                            </td>
                        </tr>


                        <tr>
                            <th>Order Discount</th>
                            <td>
                <TextInput
                    value={this.state.orderdiscount}
                    uniqueName="orderdiscount"
                    textArea={false}
                    required={false}
                    validate={this.validateEmail}
                    onChange={this.setValue.bind(this, 'orderdiscount')} />
                            </td>
                        </tr>
                            
                    </tbody>
                </table>
                <p id='insOrderSuccessMsg' className="add-order" ></p>
                <p id='insOrderEmptyMsg' className="add-order" ></p>
                <input type = "submit" value="Submit Order" />
               
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
    <OrderBox />,
    document.getElementById('content')
);
