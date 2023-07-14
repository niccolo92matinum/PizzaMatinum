import Image from 'next/image'
import styles from '../styles/Navbar.module.css'
import { connect } from 'react-redux'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

function Navbar ({ state, setIdEmailToStore }) {
  const { data: session } = useSession()

  const router = useRouter()

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

  /* const goToCartPage = () => {
    router.push('/User/cartpage')
  } */

  if (session?.admin) {
    return (
   <div className={styles.container}>
    <div className={styles.item}>
     <div className={styles.callButton}>
     </div>
     <div className={styles.texts}>
      <div className={styles.text}>Welcome</div>
      <div className={styles.text}>{session.user.name}</div>
     </div>
    </div>
    <div className={styles.item}>
     <ul className={styles.list}>
      <li className={styles.listItem} onClick={() => router.push(`/`)}><a>Home page</a></li>

      <li className={styles.listItem} onClick={() => goToPage('InsertProducts')}>Insert Products</li>

      <li className={styles.listItem} onClick={() => goToPage('Dashboard')}>Dashboard</li>

      <li className={styles.listItem}>Menu</li>
     </ul>
    </div>
    <button onClick={() => { signOut() }}>Sign Out</button>
   </div>
    )
  } else {
    return (
   <div className={styles.container}>
    <div className={styles.item}>
     <div className={styles.callButton}>
      <Image src="/img/telephone.png" alt="" width={32} height={32} />
     </div>
     <div className={styles.texts}>
      <div className={styles.text}>ORDER NOW!</div>
      <div className={styles.text}>012 345 678</div>
     </div>
    </div>
    <div className={styles.item}>
     <ul className={styles.list}>
      <Link href="/" passHref>
       <li className={styles.listItem}>Homepage</li>
      </Link>
      <li className={styles.listItem} onClick={() => goToPageSimpleUser('Menu')}>Menu</li>

     </ul>
    </div>
    <Link href="/User/cartpage" passHref>
     <div className={styles.item}>
      <div className={styles.cart}>
       <Image src="/img/cart.png" alt="" width={30} height={30} />
       <div className={styles.counter}>{counter}</div>

      </div>
     </div>
    </Link>

   </div>
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
