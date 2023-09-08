import { useSession } from 'next-auth/react'
import Navbaradmin from '../../components/Navbaradmin'
import Footer from '../../components/Footer'

export default function Login () {
  const { data: session } = useSession()

  return (
            <>
             <div className="div_img_indexpage  ">
         <div className="screen1"></div>

      </div>
           <Navbaradmin> </Navbaradmin>
            <div className=" h-screen flex items-center justify-center">
              {
                session?.admin ? <h1 className="h1_loginpage">Welcome Admin </h1> : <h1 className="h1_loginpage">Welcome Admin, you should Log In </h1>
              }

            </div>
            <div>
                <Footer></Footer>
              </div>

           </>
  )
}
