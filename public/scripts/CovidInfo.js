var LoginBox = React.createClass({

    
    render: function () {
        return (
            <div>

                <div id="covidTitle">Vaccinations</div>
                <h1>Covid-19 Testing</h1>
                <p>If you are in need of a <strong>covid</strong> test and have mild to moderate</p><br />
                <p> symptoms, we encourage you to visit a local pharmacy or one</p><br />
                <p>of our urgent care centers. The emergency room should not be your primary destination if you are looking for a <strong>COVID</strong> test.</p><br />
                <p>You should only visit the emergency room if you experience</p>
                <p>symptoms that warrant immediate medical attention, such as*:</p>
                        <ul>
                            <li>Trouble breathing</li>
                            <li>Persistent pain or pressure in the chest</li>
                            <li>New confusion or inablility to arouse</li>
                            <li>Bluish lips or face</li>
                        </ul>
                <br />       
                <br />
                <p>*This list is not all-inclusive. Please consult your medical</p>  
                <p>provider for any other symptoms that are severe or</p>     
                <p>concerning.</p>                     
            </div>
            
        );
    }
});

ReactDOM.render(
    <LoginBox />,
    document.getElementById('content')
);
