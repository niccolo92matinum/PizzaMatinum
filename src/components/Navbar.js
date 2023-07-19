import Image from 'next/image'
import styles from '../styles/Navbar.module.css'

import { connect } from 'react-redux'
import Link from 'next/link'
import { useSession, signOut, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

function Navbar ({ state, setIdEmailToStore }) {
  const { data: session } = useSession()

  const router = useRouter()
 
console.log(router.pathname)
  const goToPage = async (path) => {
    if (!state.adminData.ID) {
      setIdEmailToStore(
        {
          email: session.user.email,
          ID: session.admin.rows[0].id,
          restaurantId: session.restaurantId
        })
    }

    router.push(`/Admin/${path}`)
  }




  const [counter, setCounter] = useState(0)
  const orders = state.order
  useEffect(() => {
    const counterOrders = orders.map((singleObj) => {
      return singleObj.quantity
    })

    const final = counterOrders.reduce((a, b) => a + b, 0)
    setCounter(final)
  }, [orders])

  const goToPageSimpleUser = (path) => {
    router.push(`/User/${path}`)
  }


  let buttonSignInOut = <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => signIn()} >Sign In</button>
  
  if(session?.admin){
    buttonSignInOut  =  <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => signOut()} >Sign Out</button>
  }

  /* const goToCartPage = () => {
    router.push('/User/cartpage')
  } */

  if (session?.admin|| router.pathname === '/Admin/Login') {
    return (
      
   <div className={styles.container_admin}>
    <div className={styles.item}>
     <div className={styles.callButton}>
     </div>
     <div className={styles.texts}>
      <div className={styles.text}>Welcome</div>
      <div className={styles.text}>{session?.user.name}</div>
     </div>
    </div>
    <div className={styles.item}>
     <ul className={styles.list}>
    {/*<li className={styles.listItem} onClick={() => router.push(`/`)}><a>Home page</a></li>*/}

      <li className={styles.listItem} onClick={() => goToPage('InsertProducts')}>Insert Products</li>

      <li className={styles.listItem} onClick={() => goToPage('Dashboard')}>Dashboard</li>

      <li className={styles.listItem}>Menu</li>
     </ul>
    </div>
    {buttonSignInOut}
   
   </div>
    )
  } else {
    return (




<nav className="bg-sky-700 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <a href="https://flowbite.com/" className="flex items-center ">
      <img src="/img/PiazzaDelivery.svg" className=" mr-3 w-52 h-24" alt="Flowbite Logo"/>
  </a>
  <div className="flex md:order-2">
  <a href="https://flowbite.com/" className="flex items-center">
      <img src="/img/cart.png" className="h-8 mr-3" alt="Flowbite Logo"/>
  </a>
     
  </div>
  <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border md:flex-row md:space-x-8 md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
      <li className="  transition duration-500 hover:scale-125 ">
        <a href="#" className="block py-2 pl-3 pr-4 text-white rounded hover:bg-red-600 md:hover:bg-transparent md:hover:text-red-600 md:p-0 md:dark:hover:text-red-600 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" aria-current="page">Menu</a>
      </li>
      <li className="transition duration-500 hover:scale-125 ">
        <a href="#" className="block py-2 pl-3 pr-4 text-white rounded hover:bg-red-600 md:hover:bg-transparent md:hover:text-red-600 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
      </li>
     
    </ul>
  </div>
  </div>
</nav>

  
    )
  }
}

// ________ACTION START___________

export const setIdEmailToStore = (data) => ({
  type: 'STORE_ID_EMAIL',
  payload: data
})
// __________ACTION DONE ____________

const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = {
  setIdEmailToStore

}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
