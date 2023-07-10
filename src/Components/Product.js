import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import alert from 'sweetalert2';
import Category from './Category.json';
import { productReducer, initialState } from './Reducer/productReducer';

function Product(props) {
  const [state, dispatch] = useReducer(productReducer, initialState)
  const [logout, setlogout] = useState(false);
  const [isLocal, setisLocal] = useState(false);
  const [product, setproduct] = useState([]);
  const [indexval, setindexval] = useState("");
  const [filter, setFilter] = useState("");
  const [from, setFrom] = useState(new Date().toJSON().slice(0, 10));
  const [to, setTo] = useState(new Date().toJSON().slice(0, 10));
  const [showDates, setShowDates] = useState(false);
  const [ismenu,setIsmenu]=useState(false);
  const navigate = useNavigate();
  const clearRef = useRef();
  //Authentication
  //Date Filter Option
  useEffect(() => {
    if (props.data === '' && props.type === '') {
      navigate('/');
    } if (props.type === 'User') {
      navigate('/');
    }
    if (filter === "") {
      let products = localStorage.getItem('Products') ? JSON.parse(localStorage.getItem('Products')) : [];
      setproduct(products);
    }
    else if (filter === "Today") {
      let products = localStorage.getItem('Products') ? JSON.parse(localStorage.getItem('Products')) : [];
      let date = new Date().toJSON().slice(0, 10);
      let newSortProduct = products.filter((products) => { return products.purchased_date === date });
      setproduct(newSortProduct);
      setShowDates(false);
    }
    else if (filter === "Yesterday") {
      let products = localStorage.getItem('Products') ? JSON.parse(localStorage.getItem('Products')) : [];
      let date = new Date(new Date().setDate(new Date().getDate() - 1)).toJSON().slice(0, 10);
      let newSortProduct = products.filter((products) => { return products.purchased_date === date });
      setShowDates(false);
      setproduct(newSortProduct);
    }
    else if (filter === "This Week") {
      let products = localStorage.getItem('Products') ? JSON.parse(localStorage.getItem('Products')) : [];
      let currentDate = new Date();
      let startDate = new Date(currentDate.getFullYear(), 0, 1);
      let days = Math.floor((currentDate - startDate) /
        (24 * 60 * 60 * 1000));
      let weekNumber = Math.ceil(days / 7);
      let newSortProduct = products.filter((products) => {
        let currentDate1 = new Date(products.purchased_date);
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
      let products = localStorage.getItem('Products') ? JSON.parse(localStorage.getItem('Products')) : [];
      let currentDate = new Date();
      let startDate = new Date(currentDate.getFullYear(), 0, 1);
      let days = Math.floor((currentDate - startDate) /
        (24 * 60 * 60 * 1000));
      let weekNumber = Math.ceil(days / 7);
      let newSortProduct = products.filter((products) => {
        let currentDate1 = new Date(products.purchased_date);
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
      let products = localStorage.getItem('Products') ? JSON.parse(localStorage.getItem('Products')) : [];
      let date = new Date().toJSON().slice(0, 7);
      console.log(date);
      let newSortProduct = products.filter((products) => { let date1 = new Date(products.purchased_date).toJSON().slice(0, 7); return date1 === date });
      setShowDates(false);
      setproduct(newSortProduct);
    }
    else if (filter === 'Last Month') {
      let products = localStorage.getItem('Products') ? JSON.parse(localStorage.getItem('Products')) : [];
      let date = new Date(new Date().setMonth(new Date().getMonth() - 1)).toJSON().slice(0, 7);
      console.log(date);
      let newSortProduct = products.filter((products) => { let date1 = new Date(products.purchased_date).toJSON().slice(0, 7); return date1 === date });
      setShowDates(false);
      setproduct(newSortProduct);
    }
    else if (filter === "Custom") {
      let products = localStorage.getItem('Products') ? JSON.parse(localStorage.getItem('Products')) : [];
      let newSortProduct = products.filter((products) => { return products.purchased_date >= from && products.purchased_date <= to });
      setShowDates(true);
      setproduct(newSortProduct);
    }
  }, [filter, to, from])

  //storing local value into state variable
  useEffect(() => {
    let products = localStorage.getItem('Products') ? JSON.parse(localStorage.getItem('Products')) : [];
    setproduct(products)
  }, [isLocal])
  //Input changing process
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "ADD_DATA", payload: { field: name, value: value } });
  }

  //Input changing process
  const handleInputChange1 = e => {
    console.log(e.target.files[0]);
    dispatch({ type: "ADD_DATA", payload: { field: e.target.name, value: e.target.files[0] } })
  }

  //To clear the values when click the close button
  const handleClear = () => {
    dispatch({ type: "CLEAR_ERROR_DATA" });
    dispatch({ type: 'CLEAR_DATA' });
  }

  //To store the data into local storage 
  function isSubmit(e) {
    e.preventDefault();
    if (handleSubmit()) {
      let product = localStorage.getItem('Products') ? JSON.parse(localStorage.getItem('Products')) : [];
      let reader = new FileReader();
      reader.readAsDataURL(state.product_image);
      reader.addEventListener('load', () => {
        product.push
          ({
            product_no: state.product_no,
            product_name: state.product_name,
            category: state.category,
            price: state.price,
            purchased: state.purchased,
            purchased_date: state.purchased_date,
            product_image: reader.result,
            product_sold: 0,
            product_stock: state.purchased
          })
        localStorage.setItem('Products', JSON.stringify(product));
        dispatch({ type: 'CLEAR_DATA' });
        clearRef.current.value = null;

        props.handleProduct(product);
        setproduct(product);
        setisLocal(!isLocal);
      })
    }
  }
  //validation
  function handleSubmit() {
    let isValid = true;
    dispatch({ type: "CLEAR_ERROR_DATA" });

    if (state.product_no === '') {
      dispatch({ type: 'ERROR_DATA', payload: { field: 'product_no', error: "*Product No is mandatory" } });
      isValid = false;
    }
    if (state.product_name === '') {
      dispatch({ type: 'ERROR_DATA', payload: { field: 'product_name', error: "*Product Name is mandatory" } })
      isValid = false;
    }
    if (state.category === '') {
      dispatch({ type: 'ERROR_DATA', payload: { field: 'category', error: "*Category is mandatory" } })
      isValid = false;
    }
    if (state.price === '') {
      dispatch({ type: 'ERROR_DATA', payload: { field: 'price', error: "*Price is mandatory" } })
      isValid = false;
    }
    if (state.purchased === '') {
      dispatch({ type: 'ERROR_DATA', payload: { field: 'purchased', error: "*No of purchased is mandatory" } })
      isValid = false;
    }
    if (state.purchased_date === '') {
      dispatch({ type: 'ERROR_DATA', payload: { field: 'purchased_date', error: "*Purchased date is mandatory" } })
      isValid = false;
    }
    // if (state.product_image === '') {
    //   dispatch({ type: 'ERROR_DATA', payload: { field: 'product_image', error: "*Product image is mandatory" } })
    //   isValid = false;
    // }
    return isValid;
  }
  //Delete operations
  function handleDelete(index) {
    alert.fire({
      title: 'Do you want to delete the product?',
      icon: "question",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        alert.fire('Deleted!', '', 'success');
        setTimeout(() => {
          product.splice(index, 1);
          localStorage.setItem('Products', JSON.stringify(product));
          props.handleProduct(product);
          setproduct(product);
          setisLocal(!isLocal);
        }, 2000)
      }
    })
  }
  //Update operations
  function handleUpdate(index) {
    dispatch({ type: "ADD_DATA", payload: { field: 'product_no', value: product[index].product_no } })
    dispatch({ type: "ADD_DATA", payload: { field: 'product_name', value: product[index].product_name } })
    dispatch({ type: "ADD_DATA", payload: { field: 'category', value: product[index].category } })
    dispatch({ type: "ADD_DATA", payload: { field: 'price', value: product[index].price } })
    dispatch({ type: "ADD_DATA", payload: { field: 'purchased', value: product[index].purchased } })
    dispatch({ type: "ADD_DATA", payload: { field: 'purchased_date', value: product[index].purchased_date } })
    setindexval(index);
  }
  //Edit operation
  const handleEdit = (e) => {
    e.preventDefault();
    if (handleSubmit()) {
      let index = parseInt(indexval);

      product[index].product_no = state.product_no;
      product[index].product_name = state.product_name;
      product[index].cagtegory = state.cagtegory;
      product[index].price = state.price;
      product[index].purchased = state.purchased;
      product[index].purchased_date = state.purchased_date;
      product[index].product_stock = parseInt(state.purchased) - parseInt(product[index].product_sold)
      if (state.product_image !== "") {
        let reader = new FileReader();
        reader.readAsDataURL(state.product_image);
        reader.addEventListener('load', () => {
          product[index].product_image = reader.result;
        })
      }
      localStorage.setItem('Products', JSON.stringify(product));
      dispatch({ type: 'CLEAR_DATA' });
      props.handleProduct(product);
      setindexval("");
      setisLocal(!isLocal);
    }
  }
  return (
    <div className='box'>
      <div className='header d-flex justify-content-between'>
        <div className='head text-light d-flex gap-3 p-1'><h3><i className="fas fa-store-alt"></i></h3><h3>Product Information</h3></div>
        <div className='head text-light d-flex gap-3 p-1'><h4 className='mt-1'>{props.data}</h4><div className='login bg-light' role='button' onClick={() => { setlogout(!logout) }}><p className='text-center'>{(props.data).charAt(0)}</p></div></div>
      </div>
      {logout && <div className='d-block logout shadow rounded' role='button' onClick={() => { props.handleChangetype(""); props.handleChange(""); navigate("/"); }}><p className='p-1'><i className='fas fa-sign-out-alt'></i>Logout</p></div>}
      <div className='content-info d-flex'>
        {/* Menu List */}
        <div className='Menus' style={{width: ismenu ? "15%":"4%"}}><i className="fa fa-bars p-3 mt-3 i-color" aria-hidden="true" role="button" onClick={()=>{setIsmenu(!ismenu)}}></i>
          <div className='d-block' onClick={() => { navigate("/Product") }} style={{color:"rgb(60, 201, 226)" }}><i className="fa fa-database p-3 mt-1 i-color" style={{color:"rgb(60, 201, 226)" }}></i>{ismenu && <span className='menu-text'>Product List</span>}</div>
          <div className='d-block' onClick={() => { navigate("/Product/UserList") }}><i className="fas fa-users mt-1 i-color"></i>{ismenu && <span className='menu-text'>User List</span>}</div>
          <div className='d-block' onClick={() => { navigate("/Product/SalesReport") }}><i className="fas fa-file-alt p-3 mt-1 i-color"></i>{ismenu && <span className='menu-text'>Sales Report</span>}</div>
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
          <button className='' type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling" onClick={() => { setindexval(""); }}>+Add</button>
          <table className='table table-stripped table-hover mt-2'>
            <thead>
              <tr><th>S. No.</th><th>Product No</th><th>Product Name</th><th>Purchased</th><th>Category</th><th>Price</th><th>Sold</th><th>Stock</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {product.length ? product.map((data, index) => (<tr key={index}><td>{index + 1}</td><td>{data.product_no}</td><td>{data.product_name}</td><td>{data.purchased}</td><td>{data.category}</td><td>{data.price}</td><td>{data.product_sold}</td><td>{data.product_stock}</td><td>{parseInt(data.product_stock) === 0 ? <p className='text-danger'>Unavailable</p> : <p className='text-success'>Available</p>}</td><td><button type='button' style={{ background: "blue", float: 'left' }} onClick={() => { handleUpdate(index) }} data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling"><i className='far fa-edit'></i></button><button type="button" style={{ background: "red", float: 'left', marginLeft: "4px" }} onClick={() => { handleDelete(index) }}><i className='far fa-trash-alt'></i></button></td></tr>)) : <tr><td colSpan="10" className="text-danger" align='center'>No data is available</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasScrollingLabel">Product Form</h5>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" onClick={handleClear}></button>
          </div>
          <div className="offcanvas-body">
            <form >
              <div className='row'>
                <div className="col-md-6 p-3">
                  <label htmlFor='pno'>Product No</label>
                  <input type="number" className='form-control' name="product_no" value={state.product_no} style={{ borderColor: state.errors.product_no ? 'red' : '' }} placeholder='Product No' onChange={handleInputChange} />
                  {state.errors.product_no && <small className="text-danger">{state.errors.product_no}</small>}
                </div>
                <div className="col-md-6 p-3">
                  <label htmlFor='pname'>Product Name</label>
                  <input type="text" className='form-control' name="product_name" value={state.product_name} style={{ borderColor: state.errors.product_name ? 'red' : '' }} placeholder='Product Name' onChange={handleInputChange} />
                  {state.errors.product_name && <small className="text-danger">{state.errors.product_name}</small>}
                </div>
                <div className="col-md-6 p-3">
                  <label htmlFor='category'>Category</label>
                  <select className='form-control' name="category" value={state.category} style={{ borderColor: state.errors.category ? 'red' : '' }} onChange={handleInputChange}>
                    <option value="">--select the Category--</option>
                    {Category.map((data) => (<option value={data.Category} key={data.id}>{data.Category}</option>))}
                  </select>
                  {state.errors.category && <small className="text-danger">{state.errors.category}</small>}
                </div>
                <div className="col-md-6 p-3">
                  <label htmlFor='price'>Price</label>
                  <input type="number" className='form-control' placeholder='Price' name="price" value={state.price} style={{ borderColor: state.errors.price ? 'red' : '' }} onChange={handleInputChange} />
                  {state.errors.price && <small className="text-danger">{state.errors.price}</small>}
                </div>
                <div className="col-md-6 p-3">
                  <label htmlFor='purchased'>No of Purchased</label>
                  <input type="number" className='form-control' placeholder='No of Purchased' name="purchased" value={state.purchased} style={{ borderColor: state.errors.purchased ? 'red' : '' }} onChange={handleInputChange} />
                  {state.errors.purchased && <small className="text-danger">{state.errors.purchased}</small>}
                </div>
                <div className="col-md-6 p-3">
                  <label htmlFor='pdate'>Purchased Date</label>
                  <input type="date" className='form-control' name="purchased_date" value={state.purchased_date} style={{ borderColor: state.errors.purchased_date ? 'red' : '' }} onChange={handleInputChange} />
                  {state.errors.purchased_date && <small className="text-danger">{state.errors.purchased_date}</small>}
                </div>
                <div className="col-md-12 p-3">
                  <label htmlFor='pimage'>Product Image</label>
                  <input type="file" className='form-control' name="product_image" ref={clearRef} style={{ borderColor: state.errors.product_image ? 'red' : '' }} onChange={handleInputChange1} />
                </div>
                {indexval === "" ? <div className="col-md-12 p-3"><input type="submit" value="submit" className='btn btn-success submit' onClick={(e) => { isSubmit(e) }} /></div>
                  : <div className="col-md-12 p-3"><input type="submit" value="Update" data-bs-dismiss="offcanvas" className='btn btn-primary submit' onClick={handleEdit} /></div>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product;