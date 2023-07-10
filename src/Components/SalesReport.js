import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function SalesReport(props) {
    const [logout, setlogout] = useState(false);
    const [product, setproduct] = useState([]);
    const [ismenu,setIsmenu]=useState(false);
    const [filter, setFilter] = useState("");
    const [from, setFrom] = useState(new Date().toJSON().slice(0, 10));
    const [to, setTo] = useState(new Date().toJSON().slice(0, 10));
    const [showDates, setShowDates] = useState(false);
    const navigate = useNavigate();
    //Authentication and filter option
    useEffect(() => {
        if (props.data === '' && props.type === '') {
            navigate('/');
          } if (props.type === 'User') {
            navigate('/');
          }
        if (filter === "") {
            setproduct(props.salereport)
        }
        else if (filter === "Today") {
            let sales = localStorage.getItem('SalesReport') ? JSON.parse(localStorage.getItem('SalesReport')) : [];
            let date = new Date().toJSON().slice(0, 10);
            let newSortProduct = sales.filter((sales) => { return sales.sold_date === date });
            setproduct(newSortProduct);
            setShowDates(false);
        }
        else if (filter === "Yesterday") {
            let sales = localStorage.getItem('SalesReport') ? JSON.parse(localStorage.getItem('SalesReport')) : [];
            let date = new Date(new Date().setDate(new Date().getDate() - 1)).toJSON().slice(0, 10);
            let newSortProduct = sales.filter((sales) => { return sales.sold_date === date });
            setShowDates(false);
            setproduct(newSortProduct);
        }
        else if (filter === "This Week") {
            let sales = localStorage.getItem('SalesReport') ? JSON.parse(localStorage.getItem('SalesReport')) : [];
            let currentDate = new Date();
            let startDate = new Date(currentDate.getFullYear(), 0, 1);
            let days = Math.floor((currentDate - startDate) /
                (24 * 60 * 60 * 1000));
            let weekNumber = Math.ceil(days / 7);
            let newSortProduct = sales.filter((sales) => {
                let currentDate1 = new Date(sales.sold_date);
                let startDate1 = new Date(currentDate1.getFullYear(), 0, 1);
                let days1 = Math.floor((currentDate1 - startDate1) /
                    (24 * 60 * 60 * 1000));
                let weekNumber1 = Math.ceil(days1 / 7);
                return weekNumber === weekNumber1
            });
            setShowDates(false);
            setproduct(newSortProduct);
        }
        else if (filter === "Last Week") {
            let sales = localStorage.getItem('SalesReport') ? JSON.parse(localStorage.getItem('SalesReport')) : [];
            let currentDate = new Date();
            let startDate = new Date(currentDate.getFullYear(), 0, 1);
            let days = Math.floor((currentDate - startDate) /
                (24 * 60 * 60 * 1000));
            let weekNumber = Math.ceil(days / 7);
            let newSortProduct = sales.filter((sales) => {
                let currentDate1 = new Date(sales.sold_date);
                let startDate1 = new Date(currentDate1.getFullYear(), 0, 1);
                let days1 = Math.floor((currentDate1 - startDate1) /
                    (24 * 60 * 60 * 1000));
                let weekNumber1 = Math.ceil(days1 / 7);
                return weekNumber - 1 === weekNumber1
            });
            setShowDates(false);
            setproduct(newSortProduct);
        }
        else if (filter === 'This Month') {
            let sales = localStorage.getItem('SalesReport') ? JSON.parse(localStorage.getItem('SalesReport')) : [];
            let date = new Date().toJSON().slice(0, 7);
            console.log(date);
            let newSortProduct = sales.filter((sales) => { let date1 = new Date(sales.sold_date).toJSON().slice(0, 7); return date1 === date });
            setShowDates(false);
            setproduct(newSortProduct);
        }
        else if (filter === 'Last Month') {
            let sales = localStorage.getItem('SalesReport') ? JSON.parse(localStorage.getItem('SalesReport')) : [];
            let date = new Date(new Date().setMonth(new Date().getMonth() - 1)).toJSON().slice(0, 7);
            console.log(date);
            let newSortProduct = sales.filter((sales) => { let date1 = new Date(sales.sold_date).toJSON().slice(0, 7); return date1 === date });
            setShowDates(false);
            setproduct(newSortProduct);
        }
        else if (filter === "Custom") {
            let sales = localStorage.getItem('SalesReport') ? JSON.parse(localStorage.getItem('SalesReport')) : [];
            let newSortProduct = sales.filter((sales) => { return sales.sold_date >= from && sales.sold_date <= to });
            setShowDates(true);
            setproduct(newSortProduct);
        }
    }, [filter, to, from])
    return (
        <div className='box'>
            <div className='header d-flex justify-content-between'>
                <div className='head text-light d-flex gap-3 p-1'><h3><i className="fas fa-file-alt"></i></h3><h3>Sales Information</h3></div>
                <div className='head text-light d-flex gap-3 p-1'><h4 className='mt-1'>{props.data}</h4><div className='login bg-light' role='button' onClick={() => { setlogout(!logout) }}><p className='text-center'>{(props.data).charAt(0)}</p></div></div>
            </div>
            <div className='content-info d-flex'>
                {logout && <div className='d-block logout shadow rounded' role='button' onClick={() => { props.handleChangetype(""); props.handleChange(""); navigate("/"); }}><p className='p-1'><i className='fas fa-sign-out-alt'></i>Logout</p></div>}
                {/* Menu List */}
                <div className='Menus' style={{width: ismenu ? "15%":"4%"}}><i className="fa fa-bars p-3 mt-3 i-color" aria-hidden="true" role="button" onClick={()=>{setIsmenu(!ismenu)}}></i>
          <div className='d-block' onClick={() => { navigate("/Product") }}><i className="fa fa-database p-3 mt-1 i-color"></i>{ismenu && <span className='menu-text'>Product List</span>}</div>
          <div className='d-block' onClick={() => { navigate("/Product/UserList") }}><i className="fas fa-users mt-1 i-color"></i>{ismenu && <span className='menu-text'>User List</span>}</div>
          <div className='d-block' onClick={() => { navigate("/Product/SalesReport") }} style={{color:"rgb(60, 201, 226)" }}><i className="fas fa-file-alt p-3 mt-1 i-color" style={{color:"rgb(60, 201, 226)" }}></i>{ismenu && <span className='menu-text'>Sales Report</span>}</div>
        </div>
                {/* Filter options  */}
                <div className='container mt-3'>
                    <div className='d-flex justify-content-center gap-3'><label className='mt-2'>Filter By:</label><select className='search form-control w-25' onChange={(e) => { setFilter(e.target.value) }}>
                        <option value=''>--Date Filter--</option>
                        <option value='Today'>Today</option>
                        <option value='Yesterday'>Yesterday</option>
                        <option value='This Week'>This Week</option>
                        <option value='Last Week'>Last Week</option>
                        <option value='This Month'>This Month</option>
                        <option value='Last Month'>Last Month</option>
                        <option value='Custom'>Custom</option>
                    </select>
                        {showDates && <><label className='mt-2'>From:</label> <input type="date" value={from} max={to} onChange={(e) => { setFrom(e.target.value) }} />
                            <label className='mt-2'>To:</label><input type="date" value={to} min={from} onChange={(e) => { setTo(e.target.value) }} /></>}
                    </div>
                    <table className='table table-stripped table-hover mt-2'>
                        <thead>
                            <tr><th>S. No.</th><th>Product No</th><th>Product Name</th><th>Quantity</th><th>Total Price</th></tr>
                        </thead>
                        <tbody>
                            {product.length!==0 ? product.map((data, index) => (<tr key={index}><td>{index + 1}</td><td>{data.product_no}</td><td>{data.product_name}</td><td>{data.quantity}</td><td>{data.total_price}</td></tr>)) : <tr><td colSpan="10" className="text-danger" align='center'>No data is available</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default SalesReport