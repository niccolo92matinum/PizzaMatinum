import React from 'react'
import {useSession,signIn,signOut} from 'next-auth/react'
import styles from "../styles/Login.module.css";
import { useRouter } from "next/router";
import Navbar from '../components/Navbar'

const Login = () =>{
    const {data:session} = useSession()


    



    if(session) {
        return  (
            <>
              <Navbar></Navbar>
               
            </>
        )
    }else{
        return(
            <>
            <Navbar></Navbar>
            <div>
                <p>You are not sign in</p>
                <button onClick={()=>signIn()} className={styles.button}>Sign In</button>
            </div>
            </>
        )
    }
    
    
    
}
export default Login