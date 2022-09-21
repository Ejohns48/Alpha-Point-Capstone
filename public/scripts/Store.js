var ItemBox = React.createClass({
    getInitialState: function () {
        return { data: [], data2: [] };
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
    componentDidMount: function () {
        this.loadItemsFromServer();
    },

    render: function () {
                
        return (
            <div>
                
                <Itemform2 id="PatientList" onItemSubmit={this.loadItemsFromServer} />
                <br />
                <table className="patienttable">
                        <thead>
                            <tr>                             
                                <th>Item Name</th>                             
                                <th>Description</th>
                                <th>Price</th>
                                <th>Quantity In Stock</th>
                            </tr>
                         </thead>
                        <ItemList data={this.state.data} />
                    </table>
                    </div>                
        );
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

        var itemid = this.state.itemid.trim();
        var itemname = this.state.itemname.trim();
        var itemdescr = this.state.itemdescr.trim();
        var itemprice = this.state.itemprice.trim();
        var itemstock = this.state.itemstock.trim();              

        this.props.onItemSubmit({ 
            itemid: itemid,
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
            <div id="PatientSearchBox">
            <form id="Patientform" onSubmit={this.handleSubmit}>
            <h1 id="itemsavail">Items Available In Office Store</h1>
                <table>
                    <tbody>
                    <tr>
                            {/* <th>Item ID</th> */}
                            <td>
                            <input type="hidden" name="itemid" id="itemid" value={this.state.itemid} onChange={this.handleChange} />
                            </td>
                        </tr>
                    <tr>
                            {/* <th>Item Name</th> */}
                            <td>
                            <input type="hidden" name="itemname" id="itemname" value={this.state.itemname} onChange={this.handleChange} />
                            </td>
                        </tr>
                    <tr>
                            {/* <th>Description</th> */}
                            <td>
                                <input type="hidden" name="itemdescr" id="itemdescr" value={this.state.itemdescr} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            {/* <th>Price</th> */}
                            <td>
                            <input type="hidden" name="itemprice" id="itemprice" value={this.state.itemprice} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            {/* <th>Quantity In Stock</th> */}
                            <td>
                            <input type="hidden" name="itemstock" id="itemstock" value={this.state.itemstock} onChange={this.handleChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="hidden" value="Search Items" />

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
                itemqty={item.iteminstock}
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

    render: function () {
        
        return (

            <tr>
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
                            {this.props.itemqty}                                
                            </td>
                </tr>
        );
    }
});

ReactDOM.render(
    <ItemBox />,
    document.getElementById('content')
);