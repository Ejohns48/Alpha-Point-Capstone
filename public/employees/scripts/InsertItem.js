var ItemBox = React.createClass({

    getInitialState: function () {
        return { viewthepage: 0};   
          
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

    handleItemSubmit: function (item) {
    
        $.ajax({
            url: '/insertitem',
            dataType: 'json',
            type: 'POST',
            data: item,
            success: function(data) {
                this.setState({data:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        })
        document.getElementById('itemSuccessMsg').innerHTML = 'Item Was Added To Database';
        setTimeout(() => {
            window.location.reload(true);
        }, 1500);
        
    },
    componentDidMount: function () {
        this.loadAllowLogin();  

    },
    render: function () {
                if (this.state.viewthepage != 1) {
            return (
                <div className="accessMessage">
                <h1>Access Denied</h1>
                <p><strong>Please contact your system administrator or <a href="index.html">Log In Here</a></strong></p>                
            </div>
            );
        } else {
        return (
            <div className="ApptBox">
                <h2>New Item Information</h2>

                <Itemform2 onItemSubmit = {this.handleItemSubmit} />
            </div>
        );
        }
    }
});

var Itemform2 = React.createClass({
    getInitialState: function () {
        return {
            itemname: "",
            itemdescr: "",
            itemprice: "",
            itemstock: "",
        };
    },

    handleSubmit: function (e) {
        e.preventDefault(); 
        var itemname = this.state.itemname.trim();
        var itemdescr = this.state.itemdescr.trim();
        var itemprice = this.state.itemprice.trim();
        var itemstock = this.state.itemstock.trim();
            
        if (!itemname){
            document.getElementById('itemEmptyMsg').innerHTML = 'Fill Out Item Name'; 
            setTimeout(() => {
                document.getElementById('itemEmptyMsg').innerHTML = '';
            }, 1500);   
            return;        
        }
        if (!itemdescr){
            document.getElementById('itemEmptyMsg').innerHTML = 'Fill Out Item Description'; 
            setTimeout(() => {
                document.getElementById('itemEmptyMsg').innerHTML = '';
            }, 1500);   
            return;        
        }
        if (!itemprice){
            document.getElementById('itemEmptyMsg').innerHTML = 'Fill Out Item Price'; 
            setTimeout(() => {
                document.getElementById('itemEmptyMsg').innerHTML = '';
            }, 1500);   
            return;        
        }
        if (!itemstock){
            document.getElementById('itemEmptyMsg').innerHTML = 'Fill Out Item Stock'; 
            setTimeout(() => {
                document.getElementById('itemEmptyMsg').innerHTML = '';
            }, 1500);   
            return;        
        }
        else {
            this.props.onItemSubmit({
                itemname: itemname,
                itemdescr: itemdescr,
                itemprice: itemprice,
                itemstock: itemstock,
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
                            <th>Item Name</th>
                            <td>
                <TextInput
                    value={this.state.itemname}
                    uniqueName="itemname"
                    textArea={false}
                    required={true}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'itemname')}
                    errorMessage="Item Name is invalid"
                    emptyMessage="Item Name is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Item Description</th>
                            <td>
                <TextInput
                    value={this.state.itemdescr}
                    uniqueName="itemdescr"
                    textArea={true}
                    required={false} 
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'itemdescr')} />
                            </td>
                        </tr>
                        <tr>
                            <th>Item Price</th>
                            <td>
                <TextInput
                    value={this.state.itemprice}
                    uniqueName="itemprice"
                    textArea={false}
                    required={false}
                    onChange={this.setValue.bind(this, 'itemprice')} />
                            </td>
                        </tr>
                        <tr>
                            <th>Item Stock</th>
                            <td>
                <TextInput
                    value={this.state.itemstock}
                    uniqueName="itemstock"
                    textArea={false}
                    required={false}
                    onChange={this.setValue.bind(this, 'itemstock')} />
                            </td>
                        </tr>
                            
                    </tbody>
                </table>
                <p id='itemSuccessMsg' className="add-item" ></p>
                <p id='itemEmptyMsg' className="add-item" ></p>
                <input type = "submit" value="Add Item"/>
               
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
    <ItemBox />,
    document.getElementById('content')
);
