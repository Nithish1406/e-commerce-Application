import React, { useEffect, useReducer } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import alert from 'sweetalert2';
import {loginReducer,initialState} from './Reducer/loginReducer';

export default function Login(props) {

    const [state, dispatch] = useReducer(loginReducer, initialState);
    const navigate = useNavigate();
    const [isChange, setisChange] = useState(true);
    const [istoggle, setistoggle] = useState(true);
    const [isload, setisload] = useState(true);
    // const [val, setval] = useState("");
    useEffect(() => {
            setTimeout(()=>{setisload(!isload)},3000)
    }, [])
    //clear values
    useEffect(() => {
        dispatch({ type: 'LOGIN_CLEAR_ERROR' });
        dispatch({ type: "LOGIN_CLEAR_VALUE" });
        dispatch({ type: "LOGIN_VALID_CLEAR" });
        dispatch({ type: "CLEAR_VALUE" });
        dispatch({ type: 'CLEAR_ERROR' });
    }, [isChange]);

    //To toggle the staff and the use
    useEffect(() => {
        dispatch({ type: "LOGIN_VALID_CLEAR" });
        dispatch({ type: 'LOGIN_CLEAR_ERROR' });
        if (state.login.utype === '') {
            dispatch({ type: 'LOGIN_DATA', payload: { field: 'utype', value: 'User' } });
        }
        dispatch({ type: "LOGIN_TOGGLE_CLEAR_VALUE" });
    }, [istoggle])
    //Handle change button
    function handleChange(e) {
        const { id, name } = e.target;
        dispatch({ type: 'LOGIN_DATA', payload: { field: name, value: id } });
    }
    //Handle login input values
    const handleLoginInput = e => {
        const { name, value } = e.target;
        dispatch({ type: 'LOGIN_DATA', payload: { field: name, value: value } });
    }
    //Validation for Login form
    const handleLogin = e => {
        e.preventDefault();
        let isValid = true;
        dispatch({ type: 'LOGIN_CLEAR_ERROR' });
        dispatch({ type: 'LOGIN_VALID_CLEAR' });
        if (state.login.email === '') {
            dispatch({ type: 'LOGIN_ERROR', payload: { field: 'email', error: '*Email is required' } });
            isValid = false;
        }
        else if (!state.login.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            dispatch({ type: 'LOGIN_ERROR', payload: { field: 'email', error: '*Invalid email' } })
            isValid = false;
        }
        if (state.login.password === '') {
            dispatch({ type: 'LOGIN_ERROR', payload: { field: 'password', error: '*Password is required' } })
            isValid = false;
        }
        else if ((state.login.password).length < 6) {
            dispatch({ type: 'LOGIN_ERROR', payload: { field: 'password', error: '*Password should be minimum 6 character' } });
            isValid = false;
        }

        if (isValid) {
            let register = localStorage.getItem('RegisterData') ? JSON.parse(localStorage.getItem('RegisterData')) : [];
            let index = register.findIndex((register) => { return register.useremail === state.login.email && register.userpassword === state.login.password && register.type === state.login.utype })
            if (index === -1) {
                dispatch({ type: 'LOGIN_VALID', payload: { field: 'loginvalid', error: `Invalid email or password or change mode!` } })
                alert.fire({ position: 'center', icon: 'error', title: 'Login failed', showConfirmButton: false, timer: '1500' })
            }
            else {
                dispatch({ type: "LOGIN_CLEAR_VALUE" });
                dispatch({ type: "LOGIN_VALID_CLEAR" });

                props.handleChange(register[index].username);
                props.handleChangetype(register[index].type);
                setTimeout(() => { register[index].type === 'User' ? navigate('/Home') : navigate('/Product'); }, 1000)
                alert.fire({ position: 'center', icon: 'success', title: 'You are successfully logged in!', showConfirmButton: false, timer: '1000' })
            }
        }
    }
    //Handle Input Values
    const handleInputChange = e => {
        const { name, value } = e.target;
        dispatch({ type: 'DATA', payload: { field: name, value: value } })
    }

    //validation for new registration and storing the value in local storage
    const handleSubmit = e => {
        e.preventDefault();
        let isValid = true;
        dispatch({ type: 'CLEAR_ERROR' });
        if (state.username.trim() === '') {
            dispatch({ type: "ERROR", payload: { field: 'username', error: '*Username is required' } });
            isValid = false;
        }
        else if (!state.username.match(/^[a-zA-z\s]+$/)) {
            dispatch({ type: "ERROR", payload: { field: 'username', error: "*Username is invalid" } });
            isValid = false;
        }
        if (state.utype === '') {
            dispatch({ type: 'ERROR', payload: { field: 'utype', error: '*Type is required' } })
            isValid = false;
        }
        if (state.email.trim() === '') {
            dispatch({ type: "ERROR", payload: { field: 'email', error: "*Email is required" } });
            isValid = false;
        }
        else if (!state.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            dispatch({ type: "ERROR", payload: { field: 'email', error: "*Invalid Email" } })
            isValid = false;
        }
        if (state.npassword === '') {
            dispatch({ type: "ERROR", payload: { field: 'npassword', error: '*New Password is required' } });
            isValid = false;
        }
        else if ((state.npassword).length < 6) {
            dispatch({ type: "ERROR", payload: { field: 'npassword', error: '*New Password should be minimum 6 character' } });
            isValid = false;
        }
        if (state.cpassword === '') {
            dispatch({ type: "ERROR", payload: { field: 'cpassword', error: '*Confirm Password is required' } });
            isValid = false;
        }
        else if ((state.cpassword).length < 6) {
            dispatch({ type: "ERROR", payload: { field: 'cpassword', error: '*Confirm Password should be minimum 6 character' } });
            isValid = false;
        }
        else if (state.npassword !== state.cpassword) {
            dispatch({ type: "ERROR", payload: { field: 'cpassword', error: '*Password mismatch' } });
            isValid = false;
        }
        if (isValid) {
            let newRegister = localStorage.getItem('RegisterData') ? JSON.parse(localStorage.getItem('RegisterData')) : [];
            newRegister.push({
                username: state.username,
                type: state.utype,
                useremail: state.email,
                userpassword: state.cpassword
            })
            localStorage.setItem('RegisterData', JSON.stringify(newRegister));
            dispatch({ type: "CLEAR_VALUE" });
            setTimeout(() => { setisChange(!isChange); }, 1000);
            alert.fire({ position: 'center', icon: 'success', title: 'You are successfully registered!', showConfirmButton: false, timer: '1000' })
        }
    }

    //Rendering the components
    return (
        <>
            <div className="content">
                {/* loader */}
                {
                    isload ?
                <div className='d-flex gap-2'>
                    <div className="spinner-grow text-info" role="status">
                        
                    </div>
                    <div className="spinner-grow text-info" role="status">
                        
                    </div>
                    <div className="spinner-grow text-info" role="status">
                        
                    </div>
                    <div className="spinner-grow text-info" role="status">
                        
                    </div>
                    <div className="spinner-grow text-info" role="status">
                        
                    </div>
                </div>
                :
                <div className='Login shadow rounded'>
                    {isChange ? <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item" >
                            <a className="nav-link active" data-bs-toggle="tab" href="#login_user" id="User" name="utype" onClick={(e) => { handleChange(e); setistoggle(!istoggle) }}>User Login</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" href="#login_staff" id="Staff" name="utype" onClick={(e) => { handleChange(e); setistoggle(!istoggle) }}>Staff Login</a>
                        </li>
                    </ul> : <div className="d-flex justify-content-between" style={{ backgroundColor: "aqua" }}><h3 className="" style={{ marginLeft: "6px" }}>New Registration</h3><h3><i className="fas fa-window-close" role="button" style={{ fontSize: "37px" }} onClick={() => { setisChange(!isChange) }}></i></h3></div>}
                    {
                        isChange ?
                            <div className="tab-content">
                                <div id="login_user" className="container tab-pane active">
                                    <form className="" autoComplete='off'>
                                        <div className="row  m-4">
                                            <div className='col-md-12 p-3'>
                                                <input type="email" className="form-control" placeholder='User Email' name='email' value={state.login.email} style={{ borderColor: state.login.errors.email && "red" }} onChange={handleLoginInput} />
                                                {state.login.errors.email && <small className="text-danger">{state.login.errors.email}</small>}
                                            </div>
                                            <div className="col-md-12 p-3">
                                                <input type="password" className="form-control" placeholder='User Password' name='password' value={state.login.password} style={{ borderColor: state.login.errors.password && "red" }} onChange={handleLoginInput} />
                                                {state.login.errors.password && <small className="text-danger">{state.login.errors.password}</small>}
                                            </div>

                                            <div className="col-md-12 p-3 d-flex justify-content-center">
                                                {state.loginvalid && <small className="text-danger">{state.loginvalid}</small>}
                                            </div>
                                            <div className="col-md-12 p-3 d-flex justify-content-center">
                                                <input type="submit" className="btn btn-success" value="Login" onClick={handleLogin} />
                                            </div>
                                            <div className="col-md-12 p-3">
                                                <p className="new-register">Don't have an account?  <span className='badge bg-info text-dark' role='button' onClick={() => { setisChange(!isChange) }}>New Registration</span></p>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div id="login_staff" className="container tab-pane fade">
                                    <form className="" autoComplete='off'>
                                        <div className="row  m-4">
                                            <div className='col-md-12 p-3'>
                                                <input type="email" className="form-control" placeholder='Staff Email' name='email' value={state.login.email} style={{ borderColor: state.login.errors.email && "red" }} onChange={handleLoginInput} />
                                                {state.login.errors.email && <small className="text-danger">{state.login.errors.email}</small>}
                                            </div>
                                            <div className="col-md-12 p-3">
                                                <input type="password" className="form-control" placeholder='Staff Password' name='password' value={state.login.password} style={{ borderColor: state.login.errors.password && "red" }} onChange={handleLoginInput} />
                                                {state.login.errors.password && <small className="text-danger">{state.login.errors.password}</small>}
                                            </div>

                                            <div className="col-md-12 p-3 d-flex justify-content-center">
                                                {state.loginvalid && <small className="text-danger">{state.loginvalid}</small>}
                                            </div>
                                            <div className="col-md-12 p-3 d-flex justify-content-center">
                                                <input type="submit" className="btn btn-success" value="Login" onClick={handleLogin} />
                                            </div>
                                            <div className="col-md-12 p-3">
                                                <p className="new-register">Don't have an account?  <span className='badge bg-info text-dark' role='button' onClick={() => { setisChange(!isChange) }}>New Registration</span></p>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            :
                            <form className="" autoComplete='off'>
                                <div className="row  m-4">
                                    <div className='col-md-12 p-3'>
                                        <input type="text" className="form-control" placeholder='Name' id="userName" name="username" style={{ borderColor: state.errors.username && "red" }} value={state.username} onChange={handleInputChange} />
                                        {state.errors.username && <small className="text-danger">{state.errors.username}</small>}
                                    </div>
                                    <div className='col-md-12 p-3'>
                                        <input type="email" className="form-control" placeholder='Email' name='email' id="email" value={state.email} style={{ borderColor: state.errors.email && "red" }} onChange={handleInputChange} />
                                        {state.errors.email && <small className="text-danger">{state.errors.email}</small>}
                                    </div>
                                    <div className="col-md-12 p-3">
                                        <select className='form-control' name='utype' id='usertype' value={state.utype} style={{ borderColor: state.errors.utype && "red" }} onChange={handleInputChange}>
                                            <option value="">--Select Type--</option>
                                            <option value="User">User</option>
                                            <option value="Staff">Staff</option>
                                        </select>
                                        {state.errors.utype && <small className="text-danger">{state.errors.utype}</small>}
                                    </div>
                                    <div className="col-md-12 p-3">
                                        <input type="password" className="form-control" placeholder='New Password' name="npassword" id="newPassword" style={{ borderColor: state.errors.npassword && "red" }} value={state.npassword} onChange={handleInputChange} />
                                        {state.errors.npassword && <small className="text-danger">{state.errors.npassword}</small>}
                                    </div>
                                    <div className="col-md-12 p-3">
                                        <input type="password" className="form-control" placeholder='Confirm Password' name="cpassword" id="confirmPassword" value={state.cpassword} style={{ borderColor: state.errors.cpassword && "red" }} onChange={handleInputChange} />
                                        {state.errors.cpassword && <small className="text-danger">{state.errors.cpassword}</small>}
                                    </div>
                                    <div className="col-sm-12 p-3 d-flex justify-content-center">
                                        <input type="submit" className="btn btn-success" id="submit" value="Register" onClick={handleSubmit} />
                                    </div>
                                </div>
                            </form>
                    }
                </div>
                }
            </div>
        </>
    )
}
