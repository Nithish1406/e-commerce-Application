import React, { useMemo } from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import alert from 'sweetalert2';
import Category from './Category.json';

function Home(props) {
  const [logout, setlogout] = useState(false);
  const navigate = useNavigate();
  const [filter, setfilter] = useState("");
  const [search, setsearch] = useState(false);
  const [products, setproducts] = useState(props.product);
  const [addcart, setaddcart] = useState(props.cart);
  const [quantity, setquantity] = useState(0);
  //User Authentication
  useEffect(() => {
    if (props.data === '' && props.type === '') {
      navigate('/');
    } if (props.type === 'Staff') {
      navigate('/');
    }
    debugger
    let cartsDetails = addcart;
    let qt = 0;
    for (let i = 0; i < cartsDetails.length; i++) {
      if (cartsDetails[i].username === props.data) {
        qt += parseInt(cartsDetails[i].quantity);
      }
    }
    setquantity(qt);
  }, [])

  //filter Operations
  useMemo(() => {
    let productCategory = props.product;

    if (filter === '') {
      setproducts(productCategory);
    }
    else {
      let sortProduct = productCategory.filter((productCategory) => { return productCategory.category === filter });
      setproducts(sortProduct);
    }
  }, [search])

  //To manage the cart details
  function handleCartDetails(pno, pname, quantity, price, pimage, index, uname) {
    debugger
    let checkStock = 0;
    checkStock += parseInt(products[index].product_stock);
    let Data =addcart;
    let Data1 = Data.filter((Data) => { return Data.product_name === pname && Data.username===props.data })
    let checkQuantity = 0;
    if (Data1.length === 0) {
      checkQuantity += parseInt(quantity) + (0);
    }
    else {
      checkQuantity += parseInt(quantity) + Data1[0].quantity;
    }
    if (checkStock >= checkQuantity) {
      if (Data.length === 0) {
        Data.push({
          username: uname,
          product_no: pno,
          product_name: pname,
          quantity: parseInt(quantity),
          price: parseInt(price),
          total_price: parseInt(quantity) * parseInt(price),
          product_image: pimage
        })
       
      }
      else {
        let existingData = Data.findIndex((Data) => { return Data.product_no === pno && Data.username === uname })
        if (existingData !== -1) {
          Data[existingData].quantity += parseInt(quantity);
          Data[existingData].total_price += (parseInt(quantity) * parseInt(price));
          
        }
        else {
          Data.push({
            username: uname,
            product_no: pno,
            product_name: pname,
            quantity: parseInt(quantity),
            price: parseInt(price),
            total_price: parseInt(quantity) * parseInt(price),
            product_image: pimage
          })
        }
      }
      let cartsDetails = Data;
      let qt = 0;
      for (let i = 0; i < cartsDetails.length; i++) {
        if (cartsDetails[i].username === props.data) {
          qt += parseInt(cartsDetails[i].quantity);
        }
      }
      setquantity(qt);
      props.cartChange(Data);
      setaddcart(Data); 
    }
    else {
      alert.fire({ position: 'center', icon: 'error', title: `${products[index].product_name} Stock is not available`, showConfirmButton: false, timer: '2000' })
    }
  }
  //Logout process
  function handleLogout()
  {
   props.handleChangetype(""); props.handleChange(""); navigate("/"); 
  }

  return (
    <div>
      <div className="header-concat d-flex">
        <div className='header1 d-flex justify-content-center mt-2'>
          <div className='head text-light d-flex gap-3 p-1'><h3><i className="fas fa-th-large"></i></h3><h3>Ellokart</h3></div>
          {/* Search */}
          <div className="search p-1"><div className='input-group'>
            <select className='searchbox' onChange={(e) => { setfilter(e.target.value) }}>
              <option value="">All</option>
              {Category.map((data) => (<option value={data.Category} key={data.id}>{data.Category}</option>))}
            </select>
            <button type="button" className='search-btn' onClick={() => { setsearch(!search) }}><i className="fa fa-search" aria-hidden="true"></i></button></div></div>
          <div className="cart p-1" ><Link to="Cart"><i className="fa fa-shopping-cart mt-1 text-light" role='button' style={{ fontSize: '25px' }} aria-hidden="true"></i><p className='badge bg-danger rounded cart-qt'>{quantity}</p></Link></div>
        </div>
        <div className='head1 text-light d-flex gap-3 p-1 mt-2 justify-content-end'><h4 className='mt-1'>Hello, {props.data}</h4><div className='login1 bg-light' id="log" role='button' onClick={() => {  setlogout(!logout); }}><p className='text-center mt-1'>{(props.data).charAt(0)}</p></div></div>
      </div>

      {/* Logout options */}
      {logout && <div className='d-block logout1 shadow rounded' role='button' onClick={() => { handleLogout(); }}><p className='p-1'><i className='fas fa-sign-out-alt'></i>Logout</p></div>}

      {/* Product cards */}
      <div className='grid-box'>
        {products.map((data, index) => (
          <div className='card1 shadow rounded p-2' key={index}>
            <img src={data.product_image} alt={data.product_name} height='200' width='285' />
            <h3 className='text-center' style={{ color: "cadetblue" }}>{data.product_name}</h3>
            <h4 className='text-center'>Price: ${data.price}</h4>
            {parseInt(data.product_stock) !== 0 ? <button type='button' className='btn btn-dark w-100' onClick={() => { handleCartDetails(data.product_no, data.product_name, '1', data.price, data.product_image, index, props.data) }}>Add to Cart</button> : <button type='button' className='btn btn-dark w-100' disabled onClick={() => { handleCartDetails(data.product_no, data.product_name, '1', data.price, data.product_image, index) }}>Add to Cart</button>}
          </div>
        ))}
      </div>
    </div>

  )
}

export default Home