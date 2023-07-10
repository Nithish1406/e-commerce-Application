import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, json, useNavigate } from 'react-router-dom';
import alert from "sweetalert2";
import SalesReport from './SalesReport';

// import titanium from './images/titanium.jpg'
function Cart(props) {
    const [logout, setlogout] = useState(false);;
    const [product, setproduct] = useState(props.cart);
    const [localproduct,setlocalproduct]=useState(props.productdetail)
    const [total, settotal] = useState(0);
    const [quantity, setquantity] = useState(0);
    const navigate = useNavigate();
    let disable=false;
    let value=[];
    if(localproduct.length!==0)
    {
        debugger
        for(let i=0;i<localproduct.length;i++)
        {
            for(let j=0;j<product.length;j++)
            {
                if(product[j].username===props.data && localproduct[i].product_name===product[j].product_name && product[j].quantity>localproduct[i].product_stock)
                {
                    value.push({productname: product[j].product_name, productqunatity: parseInt(localproduct[i].product_stock)});
                    disable=true;
                }
            }
        }
    }

    useEffect(() => {
        if (props.data === '' && props.type === '') {
            navigate('/');
        } if (props.type === 'Staff') {
            navigate('/');
        }
        //availquantity Calculations
        debugger
        let cartsDetails = product;
        let sum = 0;
        let qt = 0;
        for (let i = 0; i < cartsDetails.length; i++) {
            if (cartsDetails[i].username === props.data) {
                qt += parseInt(cartsDetails[i].quantity);
                sum +=  parseInt(cartsDetails[i].quantity)*parseInt(cartsDetails[i].price);
            }
        }
        // setavailquantity(availquantity);
        // setcheck(check);
        setquantity(qt);
        settotal(sum);
    }, [product])


    function handleDelete(index) {
        alert.fire({
            title: 'Do you want to delete the cart item?',
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
                    let newData = product.filter((product) => { return product.product_name !== index });
                    setproduct(newData);
                    props.cartChange(newData);
                }, 2000)
            }
        })

    }
    function handleIncrement(index, val, pname) {
          
        let data = props.productdetail;
        let products = data.filter((data) => { return data.product_name === pname });
        if (parseInt(products[0].product_stock) >= (parseInt(val) + parseInt(product[index].quantity))) {
            let newData = [...product];
            newData[index].quantity += parseInt(val);
            newData[index].total_price += (parseInt(val) * parseInt(newData[index].price));
            let sum = 0;
            let qt = 0;
            for (let i = 0; i < newData.length; i++) {
                if (newData[i].username === props.data) {
                    qt += parseInt(newData[i].quantity);
                    sum += parseInt(newData[i].price)
                }
            }
            setquantity(qt);
            settotal(sum);
            props.cartChange(newData);
            setproduct(newData);
        }
        else {
            alert.fire({ position: 'center', icon: 'error', title: `${pname} Stock is not available`, showConfirmButton: false, timer: '2000' })
        }
    }
    function handleDecrement(index, val) {
        let newData = [...product];
        newData[index].quantity -= parseInt(val);
        newData[index].total_price -= (parseInt(val) * parseInt(newData[index].price));
        if (newData[index].quantity === 0) {
            newData.splice(index, 1);
        }
        setproduct(newData);
        props.cartChange(newData);
    }
    //handle payment 
    function handlePymentProceed() {
        debugger
        let salesReport=props.salereport;
        let product_details = props.productdetail;
        let cart_product = [...product];
        for (let i = 0; i < product_details.length; i++) {
            for (let j = 0; j < cart_product.length; j++) {
                if (product_details[i].product_name === cart_product[j].product_name && cart_product[j].username===props.data) {
                    
                    salesReport.push({product_no:cart_product[j].product_no,
                    product_name:cart_product[j].product_name,
                    sold_date:new Date().toJSON().slice(0,10),
                    quantity:cart_product[j].quantity,
                    total_price: cart_product[j].price});

                    product_details[i].product_sold += parseInt(cart_product[j].quantity);
                    product_details[i].product_stock -= parseInt(cart_product[j].quantity);
                    cart_product.splice(j,1);
                }
            }
        }
        setproduct(cart_product);
        setquantity(0);
        settotal(0);
        props.handleSales(salesReport);
        props.cartChange(cart_product);
        props.handleProduct(product_details);
        alert.fire({ position: 'center', icon: 'success', title: 'Payment Successful!', showConfirmButton: false, timer: '1500' })
    }
    return (
        <div>
            <div className="header-concat d-flex">
                <div className='mt-1'> <div className="cart p-2" ><Link to="/Home"><i className="fa fa-home mt-1 text-light" role='button' style={{ fontSize: '35px' }} aria-hidden="true"></i></Link></div></div>
                <div className='header1 d-flex mt-3'>
                    <div className='head text-light d-flex gap-3 p-1'><h3><i className="fas fa-th-large"></i></h3><h3>Ellokart</h3></div>
                </div>
                <div className='head1 text-light d-flex gap-3 p-1 mt-3 justify-content-end'><h4 className='mt-1'>{props.data}</h4><div className='login1 bg-light' id="log" role='button' onClick={() => { setlogout(!logout) }}><p className='text-center mt-1'>{(props.data).charAt(0)}</p></div></div>
            </div>
            {logout && <div className='d-block logout1 shadow rounded' role='button' onClick={() => { props.handleChangetype(""); props.handleChange(""); navigate("/"); }}><p className='p-1'><i className='fas fa-sign-out-alt'></i>Logout</p></div>}
            {/* Cart Information */}
            <div className='shop-detail'>
                <div className='shop-cart mt-5 shadow rounded'>

                    <div className='shop-cart-header'><h3 className='p-2 mt-3'>Shopping Cart</h3></div>
                    <hr />
                    {/* cart card info */}
                    {product && product.map((data, index) => (
                        data.username === props.data &&
                        <div key={index}>
                            <div className='w-100 shop-cart-item d-flex mt-2'>
                                <img src={data.product_image} alt={data.product_name} height="200" width="200" />
                                <div className="shop-cart-item-info"><h3>{data.product_name}</h3>
                                    <h4>Price: ${data.price}</h4>
                                    <h5>Quantity: {data.quantity} <button type="button" className='btn btn-secondary' onClick={() => { handleDecrement(index, "1") }}>-</button> <button type="button" className='btn btn-secondary' onClick={() => { handleIncrement(index, "1", data.product_name) }}>+</button></h5>
                                    {value.length!==0 && value.map((val,inx)=>(
                                         val.productname===data.product_name &&
                                         <h6 className='text-danger' key={inx}>Available stock is {val.productqunatity}</h6>))}
                                    <button type="button" className='btn btn-danger' onClick={() => { handleDelete(data.product_name) }}><i className='fa fa-trash'></i></button>
                                </div>
                            </div>
                            <hr />
                        </div>
                    ))
                    }
                    {/* Total */}
                    {total === 0 && <div className='text-danger text-center cart-empty'>Your ElloKart cart is empty</div>}
                    {total !== 0 && <div className='total'><h4 className='mt-2'>Total({quantity} item): ${total}</h4></div>}
                </div>
                {total !== 0 &&
                    <div className='d-block payment shadow rounded'>
                        <h4 className='p-4'>Total({quantity} item): ${total}</h4>
                        <div className='p-4'>{disable ? <button type="button" className='w-100 btn btn-dark' disabled onClick={() => { handlePymentProceed() }}>Proceed to Buy</button>: <button type="button" className='w-100 btn btn-dark' onClick={() => { handlePymentProceed() }}>Proceed to Buy</button>}</div>
                    </div>
                }
            </div>
        </div>

    )
}

export default Cart