import { useState } from 'react'
import Navbar from '../../components/Navbar'

import { useSession } from 'next-auth/react'
import { connect } from 'react-redux'
import { createId } from '@paralleldrive/cuid2'

function Menu () {

    function getCurrentURL () {
        return window.location.href
      }

      console.log(getCurrentURL())
  return (
        <>
        <Navbar></Navbar>

        <div>
           Menu
        </div>

        </>
  )
}

export default connect(null, null)(Menu)
