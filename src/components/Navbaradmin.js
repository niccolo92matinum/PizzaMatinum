import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Navbar.module.css'

import { connect } from 'react-redux'
import { useSession, signOut, signIn } from 'next-auth/react'

import { useRouter } from 'next/router'

function Navbaradmin ({ state, setIdEmailToStore }) {
  const { data: session } = useSession()

  const router = useRouter()

  const goToPage = async (path) => {
    router.push(`/Admin/${path}`)
  }

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
        ? <div className={styles.text}>
          <p className="text-black">{session?.user.name}</p></div>
        : <Link href="/" className="flex items-center ">
      <Image src="/img/PiazzaDelivery.svg" width={30} height={30} className=" mr-3 w-52 h-24" alt="Flowbite Logo"/>
  </Link>
   }

    </div>

    </div>
    <div className={styles.item}>

{session?.admin
  ? <ul className={styles.list}>
<li className={styles.listItem} onClick={() => goToPage('InsertProducts')}>Insert Products</li>

<li className={styles.listItem}onClick={() => goToPage('InsertIngredients')} >Insert Ingredients </li>

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
