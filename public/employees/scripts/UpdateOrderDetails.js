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
    updateSingleOrderDetailFromServer: function (orderdetails) {
        
        $.ajax({
            url: '/updatesingleorderdetail',
            dataType: 'json',
            data: orderdetails,
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
               
                <OrderDetailsform2 id="PatientList" onOrderDetailsSubmit={this.loadOrderDetailsFromServer} />
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
                        <OrderDetailsUpdateform id="PatientList" onUpdateSubmit={this.updateSingleOrderDetailFromServer} />
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
        var itemprice = this.state.itemprice.trim();              
        var qtyordered = this.state.qtyordered.trim();              

        this.props.onOrderDetailsSubmit({ 
            orderpurchaseid: orderpurchaseid,
            itemid: itemid,
            itemname: itemname,
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
                <h2>Search Order Details</h2>
                <table>
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
                <input type="submit" value="Search Order Details" />

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

var OrderDetailsUpdateform = React.createClass({
    getInitialState: function () {
        return {
            uporderpurchaseid2: "",                              
            upitemid2: "", 
            upitemname2: "",  
            upitemprice2: "",
            upqtyordered2: "",
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        var uporderpurchaseid2 = uporderpurchaseid.value;
        var upitemid2 = upitemid.value;
        var upitemname2 = upitemname.value;              
        var upitemprice2 = upitemprice.value;              
        var upqtyordered2 = upqtyordered.value;              

        this.props.onUpdateSubmit({ 
            uporderpurchaseid2,
            upitemid2,
            upitemname2,
            upitemprice2,
            upqtyordered2,
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
                    <h1>Update Order Details</h1>
                        <table>
                            <tbody>
                    <tr>
                            
                            <td>
                                <input type="hidden" name="uporderpurchaseid" id="uporderpurchaseid" value={this.state.uporderpurchaseid} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Item ID</th>
                            <td>
                            <input type="text" name="upitemid" id="upitemid" value={this.state.upitemid} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Item Name</th>
                            <td>
                            <input type="text" name="upitemname" id="upitemname" value={this.state.upupitemname} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Item Price</th>
                            <td>
                            <input type="text" name="upitemprice" id="upitemprice" value={this.state.upitemprice} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Quantity Ordered</th>
                            <td>
                            <input type="text" name="upqtyordered" id="upqtyordered" value={this.state.upqtyordered} onChange={this.handleUpChange} />
                            </td>
                        </tr>
</tbody>
                        </table><br />
                        <input type="hidden" name="uporderdetailkey" id="uporderdetailkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Order Details" />
                    </form>
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
    getInitialState: function () {
        return {
            uporderdetailkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theuporderdetailkey = this.props.orderdetailskey;
        
        this.loadSingleOrderDetails(theuporderdetailkey);
    },
    loadSingleOrderDetails: function (theuporderdetailkey) {
        
        $.ajax({
            url: '/getsingleorderdetails',
            data: {
                'uporderdetailkey': theuporderdetailkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log("SINGLE DATA: ",this.state.singledata);
                var populateOrderDetails = this.state.singledata.map(function (orderdetails) {
                    uporderpurchaseid.value = orderdetails.orderpurchaseid;
                    upitemid.value = orderdetails.itemid;
                    upitemname.value = orderdetails.itemname;                                  
                    upitemprice.value = orderdetails.itemprice;                                  
                    upqtyordered.value = orderdetails.qtyordered;                                  
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
                                {this.props.orderpurchaseid}
                            </td>
                            <td>
                                {this.props.itemid}
                            </td>
                            <td>
                            {this.props.itemname}                                
                            </td>
                            <td>
                            {this.props.itemprice}
                                
                            </td>
                            <td>
                            {this.props.qtyordered}
                                
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
    <OrderDetailsBox />,
    document.getElementById('content')
);