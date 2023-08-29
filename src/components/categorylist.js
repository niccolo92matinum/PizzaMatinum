import { connect } from 'react-redux'
import { useEffect, useState } from 'react'
import styles from '../styles/makeorder.module.css'

function CategoryList ({ categoryToPass }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (isClient) {
    return (
        <div>
            <ul>
              {categoryToPass.map((category, i) => {
                return (
                  <div key={category + i} className={styles.div_singlecategory}>
                    <li className="cursor-pointer">{category}</li>
                  </div>

                )
              })}
            </ul>
        </div>
    )
  } else {
    return (
                <>

                <div className=" h-screen flex items-center justify-center">
                  <h1 className="h1_loginpage">Loading....</h1>
                </div>

                </>
    )
  }
}

export default connect(null, null)(CategoryList)
