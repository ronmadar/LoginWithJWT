import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Login() {

    const [values ,  setValues] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handlerSubmit = (e) =>{
        e.preventDefault();
        axios.post('http://localhost:8081/login',values)
        .then(res => {
            if(res.data.Status === "Success"){
                navigate('/');
            }else{
                alert(res.data.Message);
            }
        })
        .catch(err => 
            console.log(err)
        );
    }

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
        <div className='bg-white p-3 rounded w-50'>
            <h2>Sign-In</h2>
            <form onSubmit ={handlerSubmit}>
                <div className='mb-3'>
                    <label htmlFor='email'><strong>Email</strong></label>
                    <input type='email' placeholder='Enter Email' name='email' autoComplete='off' className='form-control rounded-0'
                            onChange={e => setValues({...values, email: e.target.value})}/>
                </div>
                <div className='mb-3'>
                    <label htmlFor='password'><strong>Password</strong></label>
                    <input type='password' placeholder='Enter Password' name='password' autoComplete='off' className='form-control rounded-0'
                    onChange={e => setValues({...values, password: e.target.value})}/>
                </div>
                <button type='submit' className='btn btn-success w-100 rouneded-0'>Log in
                </button>
                <p>You are agree to our therms and policies</p>
                <button className='btn btn-default border w-100 bg-light rouneded-0 text-decoration-none'>Log in
                </button>
            </form>
        </div>
    </div>
  )
}
