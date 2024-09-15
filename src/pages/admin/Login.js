import { useSession } from 'next-auth/react'
import Navbaradmin from '../../components/Navbaradmin'
import Carousel from '../../components/carousel'
import Footer from '../../components/Footer'
import Image from 'next/image'

export default function Login () {
  const { data: session } = useSession()

  return (
    <>
    <div className="div_img_indexpage  ">
      <div className="screen1">
      </div>
    </div> 

    <Navbaradmin> </Navbaradmin>

    <div className=" flex grid grid-cols-2 items-center justify-center pt-20">
      <div className=" flex items-center justify-center pb-14">
         <Image
           src="/img/AdminLogin.svg"
           width={350} height={350}
           alt="icon nav"
         />
      </div>
      <div className="">
        
           {
            session?.admin ? 
            <div>
              <div>
                
              </div>
               <div>
               <h1 className="font-bold text-4xl"> {session?.user.name} </h1> 
              </div>
              <div>
              <p className="font-light text-2xl pl-8 pt-8"> ...inserisci i tuo prodotti e ingredienti</p>
              </div>

            </div>
            : <h1 className="h1_loginpage">Loading....</h1>
            }
      </div>

           
    </div>
    <div className="bg-white pt-8">
      <Carousel></Carousel>
    </div>

    <div>
    <Footer></Footer>
    </div>

    </>
  )
}
