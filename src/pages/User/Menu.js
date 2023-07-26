import Navbar from '../../components/Navbar'

import { connect } from 'react-redux'

function Menu () {
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
