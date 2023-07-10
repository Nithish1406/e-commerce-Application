import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function UserList(props) {
    const [logout, setlogout] = useState(false);
    const [logindata,setLoginData] = useState(props.loginInfo);
    const [ismenu,setIsmenu]=useState(false);
    const [filter, setFilter] = useState("");
    const navigate = useNavigate();
    //Authentication and filter option

    useEffect(() => {
        if (props.data === '' && props.type === '') {
            navigate('/');
          } if (props.type === 'User') {
            navigate('/');
          }
        if (filter === "") {
           setLoginData(props.loginInfo);
        }
        else 
        {
            const newData=props.loginInfo;
            setLoginData(newData.filter((logindata)=>{return logindata.type===filter}));
        }
    }, [filter])
    return (
        <div className='box'>
            <div className='header d-flex justify-content-between'>
                <div className='head text-light d-flex gap-3 p-1'><h3><i className="fas fa-users p-1"></i></h3><h3>User and Staff Information</h3></div>
                <div className='head text-light d-flex gap-3 p-1'><h4 className='mt-1'>{props.data}</h4><div className='login bg-light' role='button' onClick={() => { setlogout(!logout) }}><p className='text-center'>{(props.data).charAt(0)}</p></div></div>
            </div>
            <div className='content-info d-flex'>
                {logout && <div className='d-block logout shadow rounded' role='button' onClick={() => { props.handleChangetype(""); props.handleChange(""); navigate("/"); }}><p className='p-1'><i className='fas fa-sign-out-alt'></i>Logout</p></div>}
                {/* Menu List */}
                <div className='Menus' style={{width: ismenu ? "15%":"4%"}}><i className="fa fa-bars p-3 mt-3 i-color" aria-hidden="true" role="button" onClick={()=>{setIsmenu(!ismenu)}}></i>
          <div className='d-block' onClick={() => { navigate("/Product") }}><i className="fa fa-database p-3 mt-1 i-color"></i>{ismenu && <span className='menu-text'>Product List</span>}</div>
          <div className='d-block' onClick={() => { navigate("/Product/UserList") }} style={{color:"rgb(60, 201, 226)" }}><i className="fas fa-users mt-1 i-color" style={{color:"rgb(60, 201, 226)" }}></i>{ismenu && <span className='menu-text'>User and Staff List</span>}</div>
          <div className='d-block' onClick={() => { navigate("/Product/SalesReport") }} ><i className="fas fa-file-alt p-3 mt-1 i-color"></i>{ismenu && <span className='menu-text'>Sales Report</span>}</div>
        </div>
                {/* Filter options  */}
                <div className='container mt-3'>
                    <div className='d-flex justify-content-center gap-3'><label className='mt-2'>Filter By:</label><select className='search form-control w-25' onChange={(e) => { setFilter(e.target.value) }}>
                        <option value=''>--Type Filter--</option>
                        <option value='Staff'>Staff</option>
                        <option value='User'>User</option>
                    </select>
                    </div>
                    <table className='table table-stripped table-hover mt-2'>
                        <thead>
                            <tr><th>S. No.</th><th>User Name</th><th>Type</th><th>Email Id</th></tr>
                        </thead>
                        <tbody>
                            {logindata.length!==0 ? logindata.map((data, index) => (<tr key={index}><td>{index + 1}</td><td>{data.username}</td><td>{data.type}</td><td>{data.useremail}</td></tr>)) : <tr><td colSpan="10" className="text-danger" align='center'>No data is available</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default UserList