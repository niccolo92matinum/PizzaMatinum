import { useSession, signIn } from 'next-auth/react'
import styles from '../styles/Login.module.css'

// eslint-disable-next-line no-unused-vars
import Navbar from '../Components/Navbar'

function Login () {
  const { data: session } = useSession()
  console.log()
  if (session) {
    return (
            <>
              <Navbar></Navbar>

            </>
    )
  } else {
    return (
            <>
            <Navbar></Navbar>
            <div>
                <p>You are not sign in</p>
                <button onClick={() => signIn()} className={styles.button}>Sign In</button>
            </div>
            </>
    )
  }
}
export default Login
