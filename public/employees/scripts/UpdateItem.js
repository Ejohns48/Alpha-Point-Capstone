var ItemBox = React.createClass({
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
                this.loadItemsFromServer();    
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadItemsFromServer: function () {
        $.ajax({
            url: '/getitems',
            data: {
                'itemid': itemid.value,
                'itemname': itemname.value,
                'itemdescr': itemdescr.value,                
                'itemprice': itemprice.value, 
                'itemstock': itemstock.value,  
            },            
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    updateSingleItemFromServer: function (item) {
        
        $.ajax({
            url: '/updatesingleitem',
            dataType: 'json',
            data: item,
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
    },
    render: function () {
        if (this.state.viewthepage == 0) {
            return (
                <div  className="accessMessage">
                <h1>Access Denied</h1>
                <p><strong>Please contact your system administrator for privileges.</strong></p>
                </div>
            );
        } 
        else {
            return (
                <div>
                    <Itemform2 id="PatientList" onItemSubmit={this.loadItemsFromServer} />
                    <br />
                    <table className="patienttable">
                            <thead>
                                <tr>     
                                    <th>Item ID</th>                              
                                    <th>Item Name</th>                             
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Quantity In Stock</th>
                                </tr>
                            </thead>
                            <ItemList data={this.state.data} />
                        </table>
                            <ItemUpdateform id="PatientList" onUpdateSubmit={this.updateSingleItemFromServer} />
                        </div>                
            );
        }
    }
});

var Itemform2 = React.createClass({
    getInitialState: function () {
        return {
            itemid: "",
            itemname: "",
            itemdescr: "",
            itemprice: "",
            itemstock: "",
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    handleSubmit: function (e) {
        e.preventDefault();

        var itemid2 = this.state.itemid;
        var itemname = this.state.itemname.trim();
        var itemdescr = this.state.itemdescr.trim();
        var itemprice = this.state.itemprice.trim();
        var itemstock = this.state.itemstock.trim();              

        this.props.onItemSubmit({ 
            itemid: itemid2,
            itemname: itemname,
            itemdescr: itemdescr,
            itemprice: itemprice,
            itemstock: itemstock,
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
                <h2>Search Items</h2>
                <table>
                    <tbody>
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
                            <th>Description</th>
                            <td>
                                <input type="text" name="itemdescr" id="itemdescr" value={this.state.itemdescr} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Price</th>
                            <td>
                            <input type="text" name="itemprice" id="itemprice" value={this.state.itemprice} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Quantity In Stock</th>
                            <td>
                            <input type="text" name="itemstock" id="itemstock" value={this.state.itemstock} onChange={this.handleChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search Items" />

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

var ItemUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upitemid2: "",
            upitemname2: "",
            upitemdescr2: "",
            upitemprice2: "",
            upitemstock2: "",
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    handleUpSubmit: function (e) {
        e.preventDefault();
        document.getElementById('itemSuccessMsg').innerHTML = 'Record Was Updated';
        this.setState({ })
        setTimeout(() => {
            document.getElementById('itemSuccessMsg').innerHTML = ''
        }, 1500);
    
        setTimeout(() => {

            var upitemid2 = upitemid.value;
            var upitemname2 = upitemname.value;
            var upitemdescr2 = upitemdescr.value;
            var upitemprice2 = upitemprice.value;
            var upitemstock2 = upitemstock.value;
    
            this.props.onUpdateSubmit({
                upitemid2: upitemid2,
                upitemname2: upitemname2,
                upitemdescr2: upitemdescr2, 
                upitemprice2: upitemprice2, 
                upitemstock2: upitemstock2,   
            });
        }, 1500);


    },
    handleUpChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
                <div id="PatientSearchBox">
                    <form id="Patientform" onSubmit={this.handleUpSubmit} >
                    <h1>Update Item</h1>
                    
                        <table>
                            <tbody>
                            <tr>
                            
                            <td>
                            <input type="hidden" name="upitemid" id="upitemid" value={this.state.upitemid} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                            <tr>
                            <th>Item Name</th>
                            <td>
                            <input type="text" name="upitemname" id="upitemname" value={this.state.upitemname} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                    <tr>
                            <th>Description</th>
                            <td>
                                <input type="text" name="upitemdescr" id="upitemdescr" value={this.state.upitemdescr} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Price</th>
                            <td>
                            <input type="text" name="upitemprice" id="upitemprice" value={this.state.upitemprice} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Quantity In Stock</th>
                            <td>
                            <input type="text" name="upitemstock" id="upitemstock" value={this.state.upitemstock} onChange={this.handleUpChange} />
                            </td>
                        </tr>
</tbody>
                        </table><br />
                        <p  id='itemSuccessMsg' className="update-item"></p>
                        <input type="hidden" name="upitemkey" id="upitemkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Item" />
                    </form>
                </div>
        );
    }
});

var ItemList = React.createClass({
    render: function () {
        var itemNodes = this.props.data.map(function (item) {
            return (
                <Item
                key={item.itemid}
                itemkey={item.itemid}
                itemid={item.itemid}
                itemname={item.itemname}
                itemdescr={item.itemdesc}
                itemprice={item.itemprice}
                itemstock={item.iteminstock}
                >
                </Item>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {itemNodes}
            </tbody>
        );
    }
});

var Item = React.createClass({
    getInitialState: function () {
        return {
            upitemkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupitemkey = this.props.itemkey;
        
        this.loadSingleItem(theupitemkey);
    },
    loadSingleItem: function (theupitemkey) {
        
        $.ajax({
            url: '/getsingleitem',
            data: {
                'upitemkey': theupitemkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                var populateItem = this.state.singledata.map(function (item) {
                    upitemid.value = item.itemid;
                    upitemname.value = item.itemname;
                    upitemdescr.value = item.itemdesc;
                    upitemprice.value = item.itemprice;
                    upitemstock.value = item.iteminstock;                                  
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
                            {this.props.itemstock}
                                
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
    <ItemBox />,
    document.getElementById('content')
);