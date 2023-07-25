import styles from '../../styles/Login.module.css'
import { useSession, signIn } from 'next-auth/react'
import Navbaradmin from '../../components/Navbaradmin'

export default function Login () {
  const { data: session } = useSession()

  return (
            <>
           <Navbaradmin> </Navbaradmin>
            <div className=" h-screen flex items-center justify-center">
              {
                session?.admin ? <h1 className="h1_loginpage">Welcome Admin </h1> : <h1 className="h1_loginpage">Welcome Admin, you should Log In </h1>
              }

            </div>

           </>
  )
}
