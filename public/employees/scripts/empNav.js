var ShowNav = React.createClass({
    render: function(){
        return(
            <div id='navmenu'>
                 
                       
                    <a className="insert" href="insertemp.html">Insert Employee</a>
                    <a className="search" href="searchemp.html">Search Employees</a>
                    <a className="update" href="updateemp.html">Update Employee</a>

                    <a className="insert" href="insertpatient.html">Insert Patient</a>           
                    <a className="search" href="searchpatients.html">Search Patients</a>          
                    <a className="update" href="updatepatient.html">Update Patient</a>

                    <a className="insert" href="insertappt.html">Insert Appointment</a>
                    <a className="search" href="searchappts.html">Search Appointments</a>
                    <a className="update" href="updateappt.html">Update Appointment</a>

                    <a className="insert" href="insertapptdetails.html">Insert Appointment Details</a>
                    <a className="search" href="searchapptdetails.html">Search Appointment Details</a>
                    <a className="update" href="updateapptdetails.html">Update Appointment Details</a>

                    <a className="insert" href="insertitem.html">Insert Item</a>
                    <a className="search" href="searchitems.html">Search Items</a>
                    <a className="update" href="updateitems.html">Update Item</a>

                    <a className="insert" href="insertorder.html">Insert Order</a>
                    <a className="search" href="searchorders.html">Search Orders</a>
                    <a className="update" href="updateorder.html">Update Order</a>

                    <a className="insert" href="insertorderdetails.html">Insert Order Details</a>
                    <a className="search" href="searchorderdetails.html">Search Order Details</a>
                    <a className="update" href="updateorderdetails.html">Update Order Details</a>
                    
                    
                    <a href="logout.html">Log Out</a> 
               
            </div>
        );
    }
});

ReactDOM.render(
    <ShowNav />,
    document.getElementById('thenav')
);