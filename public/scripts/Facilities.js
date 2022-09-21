var LoginBox = React.createClass({

    
    render: function () {
        return (
            <div>

                <h1 id="factitle">Our Facility</h1>

                <img id="facility" src="./img/building.jpg"></img>
            </div>
        );
    }
});



ReactDOM.render(
    <LoginBox />,
    document.getElementById('content')
);

