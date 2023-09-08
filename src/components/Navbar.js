import Image from 'next/image'
import styles from '../styles/Navbar.module.css'

import { connect } from 'react-redux'
import Link from 'next/link'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

function Navbar ({ state, setIdEmailToStore }) {
  const router = useRouter()

  const [counter, setCounter] = useState(0)
  const orders = state.order
  useEffect(() => {
    const counterOrders = orders.map((singleObj) => {
      return singleObj.quantity
    })

    const final = counterOrders.reduce((a, b) => a + b, 0)
    setCounter(final)
  }, [orders])

  const homePage = router.pathname

  // sticky nav
  const [stickyClass, setStickyClass] = useState('')

  function stickNavbar () {
    const windowHeight = window.scrollY

    if (windowHeight > 150) {
      setStickyClass('sticky-nav')
    } else {
      setStickyClass('')
    }
  }

  const prova = (e) => {
    const x = e
    console.log(x, 'xxx')
  }

  useEffect(() => {
    window.addEventListener('scroll', stickNavbar)
  }, [])

  return (

<nav onScroll={(e) => { prova(e) }} className="fixed w-full z-20 top-0 left-0 h-20">
  <div className="max-w-screen-xl flex flex-wrap place-items-center justify-between m-auto ">

  <Link href="/" className="grid place-items-center h-20 pl-4">
      <Image src="/img/logoT.png"width={0}
  height={0}
  sizes="100vw" alt='icon' className= {`mr-3 w-52 ${stickyClass}`} alt="Flowbite Logo"/>
  </Link>

  {homePage === '/'
    ? <div className="flex md:order-2">
    <Link href="/User/cartpage" passHref>

      </Link>

    </div>
    : <div className="flex md:order-2">
  <Link href="/User/cartpage" passHref>
     <div className={styles.item}>
      <div className={styles.cart}>
       <Image src="/img/newCart.png" alt="" width={30} height={30} width={30} height={30} alt='icon' />
       <div className={styles.counter}>{counter}</div>

      </div>
     </div>
    </Link>

  </div> }

  <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border md:flex-row md:space-x-8 md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
      <li className="  transition duration-500 hover:scale-125 ">
        <Link href="#" className={`block py-2 pl-3 pr-4 text-prova rounded  md:p-0 ${stickyClass}`} aria-current="page">Menu</Link>
      </li>
      <li className="transition duration-500 hover:scale-125 ">
        <Link href="#" className={`block py-2 pl-3 pr-4 text-prova rounded  md:p-0  ${stickyClass}`}>About</Link>
      </li>

    </ul>
  </div>
  </div>
</nav>

  )
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
