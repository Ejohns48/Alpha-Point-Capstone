var ShowNav = React.createClass({
    render: function(){
        return(
            <div id='navmenufront'>
                 
                <div className="frontend"><a href='index.html'>Home</a></div>
                <div className="frontend"><a href='appointments.html'>Appointments</a></div>
                <div className="frontend"><a href='facility.html'>Facility</a></div>
                <div className="frontend"><a href='patients.html'>Patients & Visitors</a></div>
                <div className="frontend"><a href='store.html'>Store Information</a></div>
                <div className="frontend"><a href='about.html'>About Us</a></div>
               
            </div>
        );
    }
});

ReactDOM.render(
    <ShowNav />,
    document.getElementById('thenavfront')
);