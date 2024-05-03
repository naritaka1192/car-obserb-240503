import { Button } from '@mui/material'
import {Link, useNavigate} from "react-router-dom"
import React,{useState,useEffect} from 'react'
import Signin from "./Signin"
import {User, getAuth,onAuthStateChanged} from "firebase/auth";
import { auth } from '../firebase';

const Home=()=>{

  const [user, setUser] = useState<User | null>(null)

useEffect(()=>{

  onAuthStateChanged(auth,(user)=>{
    setUser(user)
  })
},[])

  return(
    <div>
      <h1>ホーム</h1>
      <Button><Link to="/Signin">サインイン</Link></Button>
      {user? (<Button><Link to="/App">アプリ</Link></Button>):("")}
    </div>
  )

}

export default Home