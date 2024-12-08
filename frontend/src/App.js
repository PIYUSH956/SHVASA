import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import axios from 'axios'

const App = () => {
  const [user, setUser] = useState(null);
  const [error,setError] = useState("")

  const onLogin = async (e) =>{
      console.log(e)
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', { email:e.email, password:e.password });
        console.log(response)
        if(response.status == 200){
           setUser(response.data)
        }else{

        }
      } catch (err) {
        setError('Invalid email or password');
      }
  }

  return user ? (
    <>
    <Dashboard user={user} onLogout={() => setUser(null)} />
    </>
  ) : (
    <>
    <Login onLogin={onLogin} />
    
    </>
  );
};

export default App;
