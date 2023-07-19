import styles from '../../styles/Login.module.css'
import { useSession, signIn } from 'next-auth/react'
import Navbar from '../../components/Navbar'


export default function Login () {
  const { data: session } = useSession()

  
    return (
            <>
           <Navbar> </Navbar>
           </>
    )
 
}
