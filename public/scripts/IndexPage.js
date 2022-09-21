var LoginBox = React.createClass({

    
    render: function () {
        return (
            <div>
                <div id="imgBox">
                <img id="docimg1" src="../img/alpha1.png"></img>
                </div>
                
                <div id="covidBox">
                    <p>Covid-19 Information</p>
                    <p>Vaccination, Visitation, &amp; Testing</p>
                    <a id="covidLink" href="./covidinfo.html">Learn More</a>
                </div>
               

                
            </div>
        );
    }
});



ReactDOM.render(
    <LoginBox />,
    document.getElementById('content')
);

