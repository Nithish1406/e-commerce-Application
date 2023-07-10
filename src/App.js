import './App.css';
import Home from './Components/Home';
import Login from './Components/Login';
import { Routes, Route, json } from 'react-router-dom';
import Product from './Components/Product';
import Cart from './Components/Cart';
import { useState } from 'react';
import UserList from './Components/UserList';
import SalesReport from './Components/SalesReport';



function App() {
  const [loginvalue, setloginvalue] = useState("");
  const [logintype, setlogintype] = useState('');
  let product = localStorage.getItem('Products') ? JSON.parse(localStorage.getItem('Products')) : [];
  const [products, setproducts] = useState(product);
  let sale = localStorage.getItem('SalesReport') ? JSON.parse(localStorage.getItem('SalesReport')) : [];
  const [sales,setSales]=useState(sale);
  let login=localStorage.getItem('RegisterData') ? JSON.parse(localStorage.getItem('RegisterData')) : [];
  const [logindata,setLogindata]=useState(login);
  const [cart,setcart]=useState([]);
  //login Type managing
  const handleLoginValue = (value) => {
    setloginvalue(value);
  }
  //Login username managing
  const handleLogintype = (val) => {
    setlogintype(val);
  }
  //local host product information managing
  const handleProducts = (data) => {
    localStorage.setItem('Products', JSON.stringify(data));
    setproducts(data);
  }
  //Cart information managining process
  const handleCart=(cartVal)=>
  {
    setcart(cartVal);
  }
  //Sales Information
  const handleSalesInfo=(saleInfo)=>
  {
    localStorage.setItem('SalesReport', JSON.stringify(saleInfo));
    setSales(saleInfo);
  }
  //Login datas
  const handleLoginInfo=(LoginInfo)=>{
    localStorage.setItem('RegisterData',JSON.stringify(LoginInfo));
    setLogindata(LoginInfo);
  }
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login handleChange={handleLoginValue} handleChangetype={handleLogintype} />} />
        <Route path="Home" element={<Home handleChange={handleLoginValue} handleChangetype={handleLogintype} type={logintype} data={loginvalue} product={products} cartChange={handleCart} cart={cart}/>} />
        <Route path="Home/Cart" element={<Cart handleChange={handleLoginValue} handleChangetype={handleLogintype} type={logintype} data={loginvalue} cartChange={handleCart} cart={cart} productdetail={products} handleProduct={handleProducts} handleSales={handleSalesInfo} salereport={sales} />} />
        <Route path="Product" element={<Product handleChange={handleLoginValue} handleChangetype={handleLogintype} type={logintype} data={loginvalue} handleProduct={handleProducts} />} />
        <Route path="Product/userList" element={<UserList type={logintype} data={loginvalue} loginInfo={logindata}/>}/>
        <Route path="Product/salesReport" element={<SalesReport type={logintype} data={loginvalue} salereport={sales}/>}/>
      </Routes>
    </div>
  );
}

export default App;
