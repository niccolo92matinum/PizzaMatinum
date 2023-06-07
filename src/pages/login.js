import styles from '../styles/Login.module.css'
import { useSession, signIn } from 'next-auth/react'
import Navbar from '../components/Navbar'

export default function Login () {
  const { data: session } = useSession()

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
