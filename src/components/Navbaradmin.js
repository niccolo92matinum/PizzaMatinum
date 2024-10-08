import styles from '../styles/Navbar.module.css'
import { connect } from 'react-redux'
import { useSession, signOut, signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'

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

  const [stickyClass, setStickyClass] = useState('')

  function stickNavbar () {
    const windowHeight = window.scrollY

    if (windowHeight > 80) {
      setStickyClass('sticky-nav')
    } else {
      setStickyClass('')
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', stickNavbar)
  }, [])

  return (
<>
<div className={styles.container_admin}>
    <div className={styles.item}>

     <div className={styles.texts}>
     <Link href="/" className="grid place-items-center  pl-4">
      <Image src="/img/logoT.png"width={0}
  height={0}
  sizes="100vw" alt='icon' className= {`mr-3 w-52 ${stickyClass}`} alt="Flowbite Logo"/>
  </Link>

    </div>

    </div>
    <div className={styles.item}>

{session?.admin
  ? <ul className={styles.list}>
<li className={`cursor-pointer text-black  mx-8 my-8 ${stickyClass}`} onClick={() => goToPage('InsertProducts')}>Insert Products</li>

<li className={`cursor-pointer text-black  mx-8 my-8 ${stickyClass}`} onClick={() => goToPage('InsertIngredients')} >Insert Ingredients </li>

<li className={`cursor-pointer text-black  mx-8 my-8 ${stickyClass}`} onClick={() => goToPage('Dashboard')}>Dashboard</li>

<li className={`cursor-pointer text-black  mx-8 my-8 ${stickyClass}`} >Menu</li>
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
