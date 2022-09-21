var OrderDetailsBox = React.createClass({

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
    handleOrderSubmit: function (orderdetails) {
    
        $.ajax({
            url: '/insertorderdetails',
            dataType: 'json',
            type: 'POST',
            data: orderdetails,
            success: function(data) {
                this.setState({data:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        document.getElementById('insOrderDetailsSuccessMsg').innerHTML = 'Order details Were Added';
        setTimeout(() => {
            window.location.reload(true);
        }, 1500);
    },
    componentDidMount: function () {
        this.loadAllowLogin();     
    },
    render: function () {
                if (this.state.viewthepage  == 0) {
            return (
                <div className="accessMessage">                <h1>Access Denied</h1>
                <p><strong>Please contact your system administrator or <a href="index.html">Log In Here</a></strong></p></div>
            );
        } else {
        return (
            <div className="OrderBox">
                <h2>Order Details Information</h2>
                <Orderform2 onOrderSubmit = {this.handleOrderSubmit} />
            </div>
        );
        }
    }
});

var Orderform2 = React.createClass({
    getInitialState: function () {
        return {
            dataorders: [],
            dataitems: [],
            itemqty2: "",
        };
    },

    loadItems: function() {
        $.ajax({
            url: '/getitemsfororderdetails',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({dataitems:data});
                console.log("DATA ITEMS: ", dataitems);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadOrders: function() {
        $.ajax({
            url: '/getorderdetailids',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({dataorders:data});
                console.log("DATA ITEMS: ", dataorders);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadItems();
        this.loadOrders();
    },

    handleSubmit: function (e) {

        e.preventDefault();

        var orderpurchaseid2 = ordersel.value.split('-')[2].trim();
        var itemid2 = itemsel.value.split('-')[0].trim();
        var itemname2 = itemsel.value.split('-')[1].trim();
        var itemprice2 = itemsel.value.split('-')[2].trim();
        var itemqty2 = this.state.itemqty.trim();

        this.props.onOrderSubmit({
            orderpurchaseid2,
            itemid2,
            itemname2,
            itemprice2,
            itemqty2,
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
                            <th>Purchase ID<br />(Order ID-Date-Purchase ID)</th>
                            <td>
                                <SelectList2 data={this.state.dataorders} />
                            </td>
                        </tr>
                        <tr>
                            <th>Item Purchased<br />(Item ID-Item-Price)</th>
                            <td>
                                <SelectList data={this.state.dataitems} />
                            </td>
                        </tr>
                        <tr>
                            <th>Item Quantity Ordered</th>
                            <td>
                <TextInput
                    value={this.state.itemqty}
                    uniqueName="itemqty"
                    textArea={false}
                    required={false}
                    validate={this.validateEmail}
                    onChange={this.setValue.bind(this, 'itemqty')} />
                            </td>
                        </tr>
                            
                    </tbody>
                </table>
                <p id='insOrderDetailsSuccessMsg' className="add-order-details" ></p>
                <p id='insOrderDetailsSuccessMsg' className="add-order-details" ></p>
                <input type = "submit" value="Submit Order Details" />
               
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

var SelectList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (items) {
            return (
                <option
                    key={items.itemid}
                    value={items.itemid}
                >
                    {items.itemid}-{items.itemname}-{items.itemprice}
                </option>
            );
        });
        return (
            <select name="itemsel" id="itemsel">
                {optionNodes}
            </select>
        );
    }
});

var SelectList2 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (orders) {
            return (
                <option
                    key={orders.orderid}
                    value={orders.orderpurchaseid}
                >
                    {orders.orderid}-{new Intl.DateTimeFormat("en-US", {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                }).format(new Date(orders.orderdate))}-{orders.orderpurchaseid}
                </option>
            );
        });
        return (
            <select name="ordersel" id="ordersel">
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <OrderDetailsBox />,
    document.getElementById('content')
);
