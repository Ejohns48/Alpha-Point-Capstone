var OrderDetailsBox = React.createClass({
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
    loadOrderDetailsFromServer: function () {

        $.ajax({
            url: '/getorderdetails',
            data: { 
                'orderpurchaseid': orderpurchaseid.value,                              
                'itemid': itemid.value, 
                'itemname': itemname.value,  
                'itemdescr': itemdescr.value,
                'itemprice': itemprice.value,
                'qtyordered' : qtyordered.value,
            },            
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
                console.log("ORDER DETAILS :",data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    componentDidMount: function () {
                this.loadAllowLogin();
        if (this.state.viewthepage != 0) {
        this.loadOrderDetailsFromServer();
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
                
                <OrderDetailsform2  id="PatientList" onOrderDetailsSubmit={this.loadOrderDetailsFromServer} />
                <br />
                <table className="patienttable">
                        <thead>
                            <tr>                                                            
                                <th>Order Purchase ID</th>
                                <th>Item ID</th>
                                <th>Item Name</th>
                                <th>Item Description</th>
                                <th>Item Price</th>
                                <th>Quantity Ordered</th>
                            </tr>
                         </thead>
                        <OrderDetailsList data={this.state.data} />
                    </table>
                    </div>                
        );
        }
    }
});

var OrderDetailsform2 = React.createClass({
    getInitialState: function () {
        return {
            orderpurchaseid: "",                              
            itemid: "", 
            itemname: "",  
            itemdescr: "",
            itemprice: "",
            qtyordered: "",
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    handleSubmit: function (e) {
        e.preventDefault();

        var orderpurchaseid = this.state.orderpurchaseid.trim();
        var itemid = this.state.itemid.trim();
        var itemname = this.state.itemname.trim();              
        var itemdescr = this.state.itemdescr.trim();              
        var itemprice = this.state.itemprice.trim();              
        var qtyordered = this.state.qtyordered.trim();              

        this.props.onOrderDetailsSubmit({ 
            orderpurchaseid: orderpurchaseid,
            itemid: itemid,
            itemname: itemname,
            itemdescr: itemdescr,
            itemprice: itemprice,
            qtyordered: qtyordered,
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
            
                <table className="orderform">
                <h1>Search Order Details</h1>
                    <tbody>
                    <tr>
                            <th>Order Purchase ID</th>
                            <td>
                                <input type="text" name="orderpurchaseid" id="orderpurchaseid" value={this.state.orderpurchaseid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Item ID</th>
                            <td>
                            <input type="text" name="itemid" id="itemid" value={this.state.itemid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Item Name</th>
                            <td>
                            <input type="text" name="itemname" id="itemname" value={this.state.itemname} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Item Description</th>
                            <td>
                            <input type="text" name="itemdescr" id="itemdescr" value={this.state.itemdescr} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Item Price</th>
                            <td>
                            <input type="text" name="itemprice" id="itemprice" value={this.state.itemprice} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Quantity Ordered</th>
                            <td>
                            <input type="text" name="qtyordered" id="qtyordered" value={this.state.qtyordered} onChange={this.handleChange} />
                            </td>
                        </tr>                                                
                    </tbody>                   
                </table>               
                <div>
                <input type="submit" value="Search Order Details" />
                    <br />
                    <form onSubmit={this.getInitialState}>
                        <input type="submit" value="Clear Form" />
                    </form>
                </div>
                </form>
            </div>

        </div>
        );
    }
});

var OrderDetailsList = React.createClass({
    render: function () {
        var orderDetailNodes = this.props.data.map(function (orderdetails) {
            return (
                <OrderDetails
                key={orderdetails.orderpurchaseid}
                orderdetailskey={orderdetails.orderpurchaseid}
                orderpurchaseid={orderdetails.orderpurchaseid}
                itemid={orderdetails.itemid}
                itemname={orderdetails.itemname}
                itemdescr={orderdetails.itemdescr}
                itemprice={orderdetails.itemprice}
                qtyordered={orderdetails.qtyordered}
                >
                </OrderDetails>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {orderDetailNodes}
            </tbody>
        );
    }
});

var OrderDetails = React.createClass({

    render: function () {
        
        return (

            <tr>

                            <td>
                                {this.props.orderpurchaseid}
                            </td>
                            <td>
                                {this.props.itemid}
                            </td>
                            <td>
                            {this.props.itemname}                                
                            </td>
                            <td>
                            {this.props.itemdescr}
                                
                            </td>
                            <td>
                            {this.props.itemprice}
                                
                            </td>
                            <td>
                            {this.props.qtyordered}
                                
                            </td>
                </tr>
        );
    }
});

ReactDOM.render(
    <OrderDetailsBox />,
    document.getElementById('content')
);