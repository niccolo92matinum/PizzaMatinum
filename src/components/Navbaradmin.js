import Image from 'next/image'
import styles from '../styles/Navbar.module.css'

import { connect } from 'react-redux'
import { useSession, signOut, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

function Navbaradmin ({ state, setIdEmailToStore }) {
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

  let buttonSignInOut = <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => signIn()} >Sign In</button>

  if (session?.admin) {
    buttonSignInOut = <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => signOut()} >Sign Out</button>
  }

  return (
<>
<div className={styles.container_admin}>
    <div className={styles.item}>

     <div className={styles.texts}>
      {session?.admin
        ? <div className={styles.text}>{session?.user.name}</div>
        : <a href="/" className="flex items-center ">
      <img src="/img/PiazzaDelivery.svg" className=" mr-3 w-52 h-24" alt="Flowbite Logo"/>
  </a>
   }

    </div>

    </div>
    <div className={styles.item}>

{session?.admin
  ? <ul className={styles.list}>
<li className={styles.listItem} onClick={() => goToPage('InsertProducts')}>Insert Products</li>

<li className={styles.listItem} onClick={() => goToPage('Dashboard')}>Dashboard</li>

<li className={styles.listItem}>Menu</li>
</ul>
  : null
}

    </div>
    {buttonSignInOut}

   </div>

</>
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

export default connect(mapStateToProps, mapDispatchToProps)(Navbaradmin)
