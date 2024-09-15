import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { faArrowLeft, faTrash, faCirclePlus, faCircle, faChevronDown, faChevronUp, faPlus, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { createId } from '@paralleldrive/cuid2'

import styles from '../styles/makeorder.module.css'

function CardMakeOrder ({ state, productsChoosen, setProductsChoosen, insertOrderRedux, mergeAllOrderWithSameId, setShow, show, modifyQuantityOrderRedux, ingredients }) {
  const [counter, setCounter] = useState(0)
  
  const [isClient, setIsClient] = useState(false)
  
  // mi serve questo state in ogni figlio quando vado ad aggiungere gli ingredients per ogni ordine
  const [addedIngredients, setAddedIngredients] = useState([])
  
  const [extra, setExtra] = useState(0)
  const [arrayExtra, setArrayExtra] = useState([])
  const [makePrice, setMakePrice] = useState(0)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  useEffect(() => {
    setCounter(0)
    // setMakePrice(productsChoosen.price)
    setArrayExtra([])
    setExtra(0)
    setAddedIngredients([])
    setMakePrice(0)
  }, [show])
  
  const router = useRouter()
  
  const rootFunction = (path) => {
    router.push(path)
  }
  
  const orders = state.order
  
  const onClickCheckYourOrder = (product) => {
    // creo il nuovo prodotto da inserire nello state
    const newOrder = {
      title: product.title,
      description: product.description,
      category: product.category,
      price: makePrice,
      img: product.img,
      id: product.id,
      ingredients: [...arrayExtra, ...product.ingredients || []],
      quantity: counter,
      orderId: createId(),
      time: Date.now()
      
    }
    console.log(arrayExtra, 'arrayextra')
    const sortIngredient = (arr) => {
      const ingSort = arr?.sort(function (a, b) {
        const textA = a.time
        const textB = b.time
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      })
      return ingSort
    }
    
    let newArray = [...orders]
    let stopMap = true
    
    const checkIfIdIsPresent = newArray.map((obj) => {
      return obj.id === newOrder.id
    })
    
    const idIsPresent = checkIfIdIsPresent.includes(true)
    
    const sortedIngredientNewOrder = sortIngredient(newOrder.ingredients)
    
    if (orders.length === 0) {
      newArray = [newOrder]
      insertOrderRedux(newArray)
    } else {
      const checkIfOrdersAreEqual = orders.map((singleOrder, i) => {
        const sortedIngredientSingleOrder = sortIngredient(singleOrder.ingredients)
        if (singleOrder.id === newOrder.id && JSON.stringify(sortedIngredientSingleOrder) === JSON.stringify(sortedIngredientNewOrder)) {
          const newQuantity = singleOrder.quantity + newOrder.quantity
          const newPrice = singleOrder.price + newOrder.price
          console.log('dentro2')
          
          newArray[i].quantity = newQuantity
          newArray[i].price = newPrice
          insertOrderRedux(newArray)
          stopMap = false
        } else if ((singleOrder.id === newOrder.id && JSON.stringify(sortedIngredientSingleOrder) !== JSON.stringify(sortedIngredientNewOrder)) && stopMap) {
          console.log('dentro3')
          const final = [...newArray, newOrder]
          insertOrderRedux(final)
        } else if (singleOrder.id !== newOrder.id && !idIsPresent) {
          const final = [newOrder, ...newArray]
          insertOrderRedux(final)
          console.log('dentro4')
        }
        
        return singleOrder
      })
      console.log(checkIfOrdersAreEqual)
    }
    
    // console.log(mergeNewOrder, 'new', checkSameIdOrder)
  }
  
  /* const ordersSortedByTitle = orders.sort(function (a, b) {
    const textA = a.title.toUpperCase()
    const textB = b.title.toUpperCase()
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
  }) */
  
  // una volta fatto l'ordine viene dato all'utente la possibilità di cambiare le quantità dei prodotti ordinati
  // andando ad apportare le modifiche nello stato redux
  const changeQuantityOrder = (order, num) => {
    // prendo tutti i prodotti selezionati  meno quello che sto modificando
    const ordersWithoutModifiedSingleOrder = orders.filter(singleOrder => singleOrder.orderId !== order.orderId)
    // se la quantita del prodotto selezionato è maggiore di 1 o è uguale a uno e si va a fare un piu 1 sul prodotto
    if (order.quantity > 1 || (order.quantity === 1 && num === 1)) {
      // prendo il prodotto selezionato
      
      // +1 o -1 sulla quantity
      // commenta
      order.quantity = order.quantity + num
      const newQuantity = order.quantity + 1
      const newPrice = order.price / newQuantity
      console.log('dentro1', newQuantity)
      order.price = order.price - newPrice
      // aggiorno lo store con  tutti i prodotti selezionati  meno quello che sto modificando + il prodotto modificato
      const newState = [...ordersWithoutModifiedSingleOrder, order]
      
      modifyQuantityOrderRedux(newState)
      // se la quantity del prodotto è 1 e vado clicco sul -1 elimino il prodotto dallo store
    } else if (order.quantity === 1 && num === -1) {
      const takeOffOrder2 = orders.filter((singleObj) => {
        return singleObj.orderId !== order.orderId
      })
      console.log('dentro2')
      modifyQuantityOrderRedux(takeOffOrder2)
    }
  }
  
  const sortOrderByTime = (arr) => {
    const ingSort = arr.sort(function (a, b) {
      const textA = a.time
      const textB = b.time
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
    })
    return ingSort
  }
  
  const ordersSorted = sortOrderByTime(state.order)
  
  const [activeIndex, setActiveIndex] = useState([])
  
  const handleClickOpen = (i) => {
    setActiveIndex([...activeIndex, i])
  }
  
  const handleClickClose = (i) => {
    const close = activeIndex.filter(num => num !== i)
    
    setActiveIndex(close)
  }
  
  const ingredientsProductChoosenString = productsChoosen.ingredients?.map(ingredient => ingredient.label).toString()
  // prendo tutti gli ingredienti meno quelli già presenti nel prodotto selezionato
  const leftOverIngredients = (data = [], ids = []) => data.filter(
    ({ value }) => !ids.includes(value))
    
    const idIngredientsProductChoosen = productsChoosen.ingredients?.map(ingredient => ingredient.value)
    
    const leftIngredients = leftOverIngredients(ingredients, idIngredientsProductChoosen)
    
    const deleteIngtredient = (ingredient) => {
      const final = addedIngredients.filter(ingVal => ingVal !== ingredient.value)
      setAddedIngredients(final)
    }
    
    const changePriceAdd = (price) => {
      if (counter > 1) {
        setMakePrice((prev) => {
          const result = Number(price) * counter
          const final = Number(prev) + result
          
          return final
        })
      } else {
        setMakePrice((prev) => Number(prev) + Number(price))
      }
    }
    
    const changePriceOff = (price) => {
      if (counter > 0) {
        setMakePrice((prev) => {
          const result = Number(price) * counter
          const final = Number(prev) - result
          
          return final
        })
      }
    }
    
    const calculateExtraAdd = (ingredient) => {
      // inserisco in extraArray tutti gli ingredienti aggiunti
      setArrayExtra([...arrayExtra, { ...ingredient, status: 'added' }])
      
      if (counter > 1) {
        // se i prodotti sono piu di 1
        setExtra((prev) => {
          const result = Number(ingredient.price) * counter
          const result2 = Number(prev) + result
          return result2
        })
      } else {
        // se il prodotto è solo uno
        setExtra(prev => Number(prev) + Number(ingredient.price))
      }
    }
    
    const calculateExtraOff = (ingredient) => {
      // elimino dall'array l'ingrediente selezionato
      const newArr = arrayExtra.filter(single => single.value !== ingredient.value)
      setArrayExtra(newArr)
      
      // se i prodotti sono piu di 1
      if (counter === 0 && extra !== 0) {
        setExtra((prev) => {
          const result = Number(ingredient.price)
          const result2 = Number(prev) - result
          return result2
        })
      } else {
        setExtra((prev) => {
          const result = Number(ingredient.price) * counter
          const result2 = Number(prev) - result
          return result2
        })
      }
    }
    
    const changePriceByPlusButton = (priceProduct) => {
      setCounter((prevState) => {
        const newCounter = prevState + 1
        if (newCounter > 1) {
          //  calcolo del prezzo tottale
          
          setMakePrice(() => {
            // map di ogni singolo prezzo
            const arrNumber = arrayExtra.map((singleIngredient) => {
              const result = Number(singleIngredient.price)
              return result
            })
            // somma di ogni singolo prezzo (ingrediente) moltiplicato per la quantita del prodotto
            const sum = arrNumber.reduce((a, b) => a + (b * newCounter), 0)
            // update extra prezzo
            setExtra(sum)
            // calcolo del nuovo prezzo dell'intero ordine
            const price = priceProduct * newCounter
            // aggingo l'extra al prezzo dell'intero ordine
            const priceWithExtra = price + sum
            return priceWithExtra
          })
        } else if (newCounter === 1) {
          // calcolo  prezzo con un solo prodotto , prezzo prodotto + extra se ci sono
          const priceWithExtra = priceProduct + extra
          setMakePrice(priceWithExtra)
        }
        return newCounter
      })
    }
    
    const changePriceByMinusButton = (priceProduct) => {
      setCounter((prevState) => {
        const newCounter = prevState - 1
        if (prevState > 0) {
          setMakePrice(() => {
            // map di ogni singolo prezzo
            const arrNumber = arrayExtra.map((singleIngredient) => {
              const result = Number(singleIngredient.price)
              return result
            })
            // somma di ogni singolo prezzo (ingrediente) moltiplicato per la quantita del prodotto
            const sum = arrNumber.reduce((a, b) => Number(a) + (Number(b) * newCounter), 0)
            const singleSum = arrNumber.reduce((a, b) => Number(a) + (Number(b)), 0)
            // update extra prezzo
            setExtra(sum)
            // calcolo del nuovo prezzo dell'intero ordine
            const price = Number(priceProduct)
            // aggingo l'extra al prezzo dell'intero ordine
            
            const priceWithoutExtra = Number(makePrice) - Number(singleSum)
            const final = priceWithoutExtra - price
            
            return final
          })
        }
        return newCounter
      })
    }
    
    const onButtonPlusIngredient = (addedIngredients, ingredient) => {
      if (counter > 0) {
        setAddedIngredients([...addedIngredients, ingredient.value])
        changePriceAdd(ingredient.price)
        calculateExtraAdd(ingredient)
      }
    }
    const onDeleteButtonIngredien = (ingredient) => {
      deleteIngtredient(ingredient)
      changePriceOff(ingredient.price)
      calculateExtraOff(ingredient)
    }
    
    const totalPriceOrder = state.order.reduce(
      (accumulator, currentValue) => accumulator + currentValue.price,
      0
      )
      
      if (show) {
        return (
          
          <div className=" rounded-lg mx-8 border-2 bg-white border-uno drop-shadow-xl">
          <div className="pt-2 ">
          <div className="grid  place-items-end pr-4 relative">
          
          <button onClick={() => { setShow(false); setAddedIngredients([]) }} type="button"
          className="flex cursor-pointer middle  none center rounded-lg  font-sans  transition-all duration-500 hover:shadow-tre hover:scale-125  disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
          <FontAwesomeIcon icon={faCircleXmark} size="2xl" style={{ color: '#ff8551' }} />
          
          </button>
          
          </div>
          <div className="grid  place-items-center  ">
          <h2 className="font-bold text-lg">{productsChoosen.title} </h2>
          </div>
          
          </div>
          
          <div className="max-w-2xl mx-auto ">
          
          {(productsChoosen.img !== null) && <Image className=" p-8" src={productsChoosen.img} className={styles.image_card_makeorder} width={600} height={600} alt="product image" />}
          
          <div className=" pb-5">
          
          {productsChoosen.ingredients &&
            <div className="flex flex-col items-center ">
            
            <div className="pt-4">
            <p className="font-bold"> da {productsChoosen.price}  €</p>
            </div>
            <div className="pt-4">
            <p className="font-extralight text-xs">{ingredientsProductChoosenString}</p>
            </div>
            
            <div className="flex justify-between w-full">
            <div>
            <h2 className="font-bold text-lg pl-4">Extra</h2>
            </div>
            <div>
            {extra > 0 ? <p className="pr-12 font-extralight">+ {extra} €</p> : null}
            
            </div>
            </div>
            <div className="w-full">
            
            {
              leftIngredients.map((ingredient) => {
                const booleanColor = addedIngredients.includes(ingredient.value)
                return (
                  
                  <div key={ingredient.value} className="  flex border-t-2 border-t-stone-300 w-full py-2">
                  <button onClick={() => { !booleanColor && onButtonPlusIngredient(addedIngredients, ingredient) }} className="pl-4 pr-4">
                  <FontAwesomeIcon icon={booleanColor ? faCircle : faCirclePlus} style={booleanColor ? { color: '#9BCDD2' } : { color: '#FF8551' } } />
                  </button>
                  <p>
                  {ingredient.label}
                  </p>
                  <div className="flex justify-end w-3/4 pr-4 ">
                  <p>
                  + {ingredient.price} €
                  </p>
                  {booleanColor &&
                    <div className="pl-4">
                    
                    <button onClick={() => { onDeleteButtonIngredien(ingredient) }}>
                    <FontAwesomeIcon icon={faTrash} style={{ color: '#FF8551' }} />
                    </button>
                    </div>
                    
                  }
                  
                  </div>
                  
                  </div>
                  
                  )
                })
              }
              
              </div>
              
              </div>
            }
            
            <div className="grid grid-cols-3 gap-4 mt-8  ">
            
            <div className="flex flex-col items-center ml-28">
            <button type="button"
            className=" border-sky-100 border-2 middle  none center rounded-lg bg-white py-3 px-4 font-sans text-xs font-bold uppercase text-sky-600  shadow-md shadow-sky-600/20 transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-sky-600/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            onClick={() => { counter > 0 && changePriceByMinusButton(productsChoosen.price) }}>-</button>
            </div>
            <div className="flex items-center justify-center">
            <p className="">{counter}</p>
            </div>
            <div className="flex flex-col items-center mr-28">
            <button type="button"
            className=" border-sky-100 border-2 middle  none center rounded-lg bg-white py-3 px-4 font-sans text-xs font-bold uppercase text-sky-600  shadow-md shadow-sky-600/20 transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-sky-600/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            onClick={() => { changePriceByPlusButton(productsChoosen.price) }}>+</button>
            </div>
            
            </div>
            
            <div className="flex flex-col items-center mt-12">
            {counter > 0 &&
              <div className=" flex cursor-pointer middle  none center rounded-lg bg-tre py-3 px-4 font-sans text-xs font-bold uppercase text-white  transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-tre focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={() => { onClickCheckYourOrder(productsChoosen); setShow(false) }}>
              <p>Aggiungi all'ordine</p>
              <p className="pl-8">{makePrice} €</p>
              </div> }
              </div>
              
              </div>
              </div>
              </div>
              
              )
            } else {
              return (
                <>
                
                <div className="ml-4  bg-quattro ">
                <div className=" flex flex-col-2 justify-around m-auto " >
                <div>
                <h1 className={styles.h1_cartpage}>Il tuo ordine</h1>
                </div>
                <div>
                <h1 className={styles.h1_cartpage}>{isClient ? totalPriceOrder : 0} € </h1>
                </div>
                
                </div>
                
                <div className="flex flex-col items-center pt-4 ">
                <button className=" middle mt-18   none center rounded-lg bg-tre py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none "
                onClick={() => rootFunction('/User/cartpage')}>
                VAI AL PAGAMENTO
                </button>
                
                </div>
                
                {isClient
                  ? <div className="px-4">
                  
                  <ul className="list-none overflow-scroll h-[450px] ">
                  { ordersSorted.map((order, index) => {
                    const priceEachOrder = order.price
                    
                    const ingredientVisible = order.ingredients?.filter(x => x.status === 'added')
                    
                    // rendo invisibile il buttone per mostrare gli ingredienti se il prodotto non ha ingredienti
                    const buttonDown = ingredientVisible.length > 0
                    ? <button className="bg-quattro" onClick={() => handleClickOpen(index)}>
                    <FontAwesomeIcon icon={faChevronDown} style={{ color: '#ff8551' }} />
                    </button>
                    : null
                    // rendo invisibile il buttone per nascondere gli ingredienti se il prodotto non ha ingredienti
                    const buttonUp = ingredientVisible.length > 0
                    ? <button className="bg-quattro" onClick={() => handleClickClose(index)}>
                    <FontAwesomeIcon icon={faChevronUp} style={{ color: '#ff8551' }} />
                    </button>
                    : null
                    
                    return (
                      <div className="bg-white rounded-lg border-2 border-grey-200 m-2" key={order.orderId} >
                      <li className="pb-3 pt-4 sm:pb-4">
                      <div className="flex items-center grid-cols-2">
                      
                      <div className="flex  ml-4 mr-4 w-8/12 ">
                      <div className="flex  grid place-items-center rounded-full w-8 h-8 bg-due">
                      
                      <p className="font-light text-base ">{order.quantity} </p>
                      
                      </div>
                      <div className="flex  grid place-items-center  ml-4  ">
                      <p className="font-light text-base">{order.title} </p>
                      
                      </div>
                      
                      </div>
                      <div className="ml-4 mr-4  w-3/12  ">
                      <div className="flex grid-cols-2" >
                      <h5 className="font-light text-base">{priceEachOrder} €</h5>
                      <button className="pl-4" onClick={() => changeQuantityOrder(order, -1)}>
                      <FontAwesomeIcon icon={faTrash} style={{ color: '#FF8551' }} />
                      </button>
                      
                      </div>
                      
                      {/* qui c'erano i bottoni */}
                      </div>
                      </div>
                      
                      <div className="" key={order.orderId} >
                      <div className="w-full grid place-items-center">
                      
                      {!activeIndex.includes(index)
                        ? buttonDown
                        : buttonUp }
                        </div>
                        {
                          
                          ingredientVisible?.map((x) => {
                            const check = activeIndex.includes(index)
                            
                            return (
                              <div key={Math.random()}>
                              {check && <div className="grid grid-cols-3">
                              
                              <div className="grid place-items-center"><FontAwesomeIcon icon={faPlus} style={{ color: '#FF8551' }} /></div>
                              <div> <p className="text-sm ">{x.label}</p></div>
                              <div><p className="text-sm ">{x.price} € </p></div>
                              
                              </div> }
                              </div>
                              
                              )
                            })
                          }
                          
                          </div>
                          </li>
                          
                          </div>
                          )
                        })}
                        </ul>
                        
                        </div>
                        : 'Waiting'}
                        
                        </div>
                        {(isClient && state.order.length > 0)
                          ? null
                          : <div className="flex flex-col items-center pt-8">
                          <FontAwesomeIcon className={styles.arrow_card} icon={faArrowLeft} beatFade />
                          </div>}
                          
                          </>
                          )
                        }
                      }
                      
                      export const insertOrderRedux = (data) => ({
                        type: 'INSERT_SINGLE_ORDER',
                        payload: data
                      })
                      
                      export const mergeAllOrderWithSameId = (data) => ({
                        type: 'MERGE_ALL_ORDER_WITH_SAME_ID',
                        payload: data
                      })
                      
                      export const modifyQuantityOrderRedux = (data) => ({
                        type: 'MODIFY_QUANTITY_ORDER',
                        payload: data
                      })
                      
                      const mapStateToProps = (state) => ({
                        state
                      })
                      
                      const mapDispatchToProps = {
                        insertOrderRedux,
                        mergeAllOrderWithSameId,
                        modifyQuantityOrderRedux
                      }
                      
                      export default connect(mapStateToProps, mapDispatchToProps)(CardMakeOrder)
                      