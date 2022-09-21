var OrderBox = React.createClass({
    getInitialState: function () {
        return { data: [], data2: [],viewthepage: 0 };
    },
        loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedin',
            dataType: 'json',
            cache: false,
            success: function (datalog) {
                this.setState({ data2: datalog });                
                this.setState({ viewthepage: this.state.data2[0].positionID });     
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadOrdersFromServer: function () {

        $.ajax({
            url: '/getorders',
            data: {
                'orderid': orderid.value,  
                'orderpurchaseid': orderpurchaseid.value,   
                'orderdate': orderdate.value,
                'ordertotal': ordertotal.value,
                'orderdiscount' : orderdiscount.value,
            },            
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
                console.log("ORDERS: ", data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    updateSingleOrderFromServer: function (order) {
        
        $.ajax({
            url: '/updatesingleorder',
            dataType: 'json',
            data: order,
            type: 'POST',
            cache: false,
            success: function (upsingledata) {
                this.setState({ upsingledata: upsingledata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        window.location.reload(true);
    },
    componentDidMount: function () {
                this.loadAllowLogin();
        if (this.state.viewthepage != 0) {
        this.loadOrdersFromServer();
        }
    },

    render: function () {
                if (this.state.viewthepage == 0) {
            return (
                <div  className="accessMessage">
                <h1>Access Denied</h1>
                <p><strong>Please contact your system administrator for privileges.</strong></p>
                </div>
            );
        } else {
        return (
            <div>
                
                <Orderform2  id="PatientList" onOrderSubmit={this.loadOrdersFromServer} />
                <br />
                <table className="patienttable">
                        <thead>
                            <tr>                                   
                                <th>Order ID</th>                             
                                <th>Order Purchase ID</th>
                                <th>Order Date</th>
                                <th>Order Total</th>
                                <th>Order Discount</th>
                            </tr>
                         </thead>
                        <OrderList data={this.state.data} />
                    </table>
                        <OrderUpdateform  id="PatientList" onUpdateSubmit={this.updateSingleOrderFromServer} />
                    </div>                
        );
        }
    }
});

var Orderform2 = React.createClass({
    getInitialState: function () {
        return {
            orderid: "",
            orderpurchaseid: "",
            orderdate: "",
            ordertotal: "",
            orderdiscount: "",
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    handleSubmit: function (e) {
        e.preventDefault();

        var orderid = this.state.orderid.trim();
        var orderpurchaseid = this.state.orderpurchaseid.trim();          
        var orderdate = this.state.orderdate.trim();              
        var ordertotal = this.state.ordertotal.trim();              
        var orderdiscount = this.state.orderdiscount.trim();              

        this.props.onOrderSubmit({ 
            orderid: orderid,
            orderpurchaseid: orderpurchaseid,
            orderdate: orderdate,
            ordertotal: ordertotal,
            orderdiscount: orderdiscount,
        });

    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
        <div>
            <div id="PatientSearchBox">
            <form id="Patientform" onSubmit={this.handleSubmit}>
                <h2>Search Orders</h2>
                <table>
                    <tbody>
                    <tr>
                            <th>Order ID</th>
                            <td>
                            <input type="text" name="orderid" id="orderid" value={this.state.orderid} onChange={this.handleChange} />
                            </td>
                        </tr>
                    <tr>
                            <th>Order Purchase ID</th>
                            <td>
                                <input type="text" name="orderpurchaseid" id="orderpurchaseid" value={this.state.orderpurchaseid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Date</th>
                            <td>
                            <input type="date" name="orderdate" id="orderdate" value={this.state.orderdate} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Total</th>
                            <td>
                            <input type="text" name="ordertotal" id="ordertotal" value={this.state.ordertotal} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Discount</th>
                            <td>
                            <input type="text" name="orderdiscount" id="orderdiscount" value={this.state.orderdiscount} onChange={this.handleChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search Orders" />

            </form>
            <div>
                    <br />
                    <form onSubmit={this.getInitialState}>
                        <input type="submit" value="Clear Form" />
                    </form>
            </div>
            </div>

        </div>
        );
    }
});

var OrderUpdateform = React.createClass({
    getInitialState: function () {
        return {
            uporderid2: "",
            uporderpurchaseid2: "",
            uporderdate2: "",
            upordertotal2: "",
            uporderdiscount2: "",
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        var uporderid2 = uporderid.value;
        var uporderpurchaseid2 = uporderpurchaseid.value;           
        var uporderdate2 = uporderdate.value;              
        var upordertotal2 = upordertotal.value;              
        var uporderdiscount2 = uporderdiscount.value;              

        this.props.onUpdateSubmit({ 
            uporderid2: uporderid2,
            uporderpurchaseid2: uporderpurchaseid2,
            uporderdate2: uporderdate2,
            upordertotal2: upordertotal2,
            uporderdiscount2: uporderdiscount2,
        });
    },
    handleUpChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
                <div id="PatientSearchBox">
                    <form id="Patientform" onSubmit={this.handleUpSubmit}>
                    <h1>Update Orders</h1>
                        <table>
                            <tbody>
                            <tr>
                            <th>Order ID</th>
                            <td>
                            <input type="hidden" name="uporderid" id="uporderid" value={this.state.uporderid} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                    <tr>
                            <th>Order Purchase ID</th>
                            <td>
                                <input type="text" name="uporderpurchaseid" id="uporderpurchaseid" value={this.state.uporderpurchaseid} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Date</th>
                            <td>
                            <input type="date" name="uporderdate" id="uporderdate" value={this.state.uporderdate} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Total</th>
                            <td>
                            <input type="text" name="upordertotal" id="upordertotal" value={this.state.upordertotal} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Discount</th>
                            <td>
                            <input type="text" name="uporderdiscount" id="uporderdiscount" value={this.state.uporderdiscount} onChange={this.handleUpChange} />
                            </td>
                        </tr>
</tbody>
                        </table><br />
                        <input type="hidden" name="uporderkey" id="uporderkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Item" />
                    </form>
                </div>
        );
    }
});

var OrderList = React.createClass({
    render: function () {
        var orderNodes = this.props.data.map(function (order) {
            return (
                <Order
                key={order.orderid}
                orderkey={order.orderid}
                orderid={order.orderid}
                orderpurchaseid={order.orderpurchaseid}
                orderdate={order.orderdate}
                ordertotal={order.ordertotal}
                orderdiscount={order.orderdiscount}
                >
                </Order>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {orderNodes}
            </tbody>
        );
    }
});

var Order = React.createClass({
    getInitialState: function () {
        return {
            uporderkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theuporderkey = this.props.orderkey;
        
        this.loadSingleOrder(theuporderkey);
    },
    loadSingleOrder: function (theuporderkey) {
        
        $.ajax({
            url: '/getsingleorder',
            data: {
                'uporderkey': theuporderkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log("SINGLE DATA: ",this.state.singledata);
                var populateOrder = this.state.singledata.map(function (order) {
                    uporderid.value = order.orderid;
                    uporderpurchaseid.value = order.orderpurchaseid;                                                  
                    uporderdate.value = new Date(order.orderdate).toISOString().slice(0,10);                                    
                    upordertotal.value = order.ordertotal;                                  
                    uporderdiscount.value = order.orderdiscount;                                  
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        
    },

    render: function () {
        
        return (

            <tr>
                            <td>
                                {this.props.orderid}
                            </td>
                            <td>
                                {this.props.orderpurchaseid}
                            </td>
                            <td>
                            {new Intl.DateTimeFormat("en-US", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: '2-digit'
                                }).format(new Date(this.props.orderdate))}                                                     
                            </td>
                            <td>
                            {this.props.ordertotal}
                                
                            </td>
                            <td>
                            {this.props.orderdiscount}
                                
                            </td>
                            <td>
                                <form onSubmit={this.updateRecord}>
                                    <input type="submit" value="Update Record" />
                                </form>
                            </td>
                </tr>
        );
    }
});

ReactDOM.render(
    <OrderBox />,
    document.getElementById('content')
);