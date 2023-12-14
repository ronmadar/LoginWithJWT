import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Home() {
  const [auth , setAuth] = useState(false);
  const [name , setName] = useState('');
  const [message , setMessage] = useState('');

  axios.defaults.withCredentials = true;

  // use useeffect check if this user already logged, means token in our cookie available or not
  useEffect(() => {
    axios.get('http://localhost:8081')
    .then(res => {
      if(res.data.Status === 'Success'){
        setAuth(true);
        setName(res.data.name);
      }else{
        setAuth(false);
        // return Message from our server side
        setMessage(res.data.Message);
      }
    })
  }, []);

  const handlerLogout = () => {
    axios.get('http://localhost:8081/logout')
    .then(res => {
      if(res.data.Status === 'Success'){
        /*
          Refreshes the current page, and the parameter true indicates a hard refresh, 
          which means it reloads the page from the server instead of using the cached version.
        */
        window.location.reload(true);
      }else{
        alert('error');
      }
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div className='container mt-4'>
      {
        auth ?
        <div> 
            <h3>You are Atuhorized {name} </h3>
            <button className='btn btn-danger' onClick={handlerLogout}>Logout</button>
        </div>  
        :
        <div> 
            <h3>{message}</h3>
            <h3>Login Now</h3>
            <Link to="/login" className='btn btn-primary'>Login</Link>
        </div>
      }
    </div>
  )
}
