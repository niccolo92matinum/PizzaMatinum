import Image from "next/image";
import styles from "../styles/Navbar.module.css";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import Link from "next/link";
import {useSession,signIn,signOut} from 'next-auth/react'
import { useEffect, useState } from "react";
import { useRouter } from "next/router";



const Navbar = ({state, setIdEmailToStore}) => {
  //console.log(state, 'stateRedux')
  
  const {data:session} = useSession()
  
  
  
  const router = useRouter();
  
  
  
  const checkAdmin = async (path) => {
    try {
      const response = await fetch(
        `/api/admins?email=${session.user.email}`,
        {method:'GET'}
        )
        const jsonData = await response.json();
        if(jsonData.rows.length !== 0){
          
          setIdEmailToStore(
            {
              email:session.user.email,
              ID:jsonData.rows[0].id
            })
            
            router.push(`/admin/${path}`);
          }else{
            router.push("/");
          }
          
          
          
        } catch (error) {
          console.log('error' , error )
        }
        
      };
      
      if(session){
        return(
          <div className={styles.container}>
          <div className={styles.item}>
          <div className={styles.callButton}>
          <Image  href={session.user.image}  alt="" width={32} height={32} />
          </div>
          <div className={styles.texts}>
          <div className={styles.text}>Welcome</div>
          <div className={styles.text}>{session.user.name}</div>
          </div>
          </div>
          <div className={styles.item}>
          <ul className={styles.list}>
          <li className={styles.listItem} onClick={()=>checkAdmin('Dashboard')}><a>Home page</a></li>
          
          <li className={styles.listItem} onClick={()=>checkAdmin('InsertProducts')}>Insert Products</li>
          
          <li className={styles.listItem}>Menu</li>
          </ul>
          </div>
          <button onClick={()=>{signOut()}}>Sign Out</button>
          </div>
          )
          
        }else{
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
            <li className={styles.listItem}>Products</li>
            <li className={styles.listItem}>Menu</li>
            <Image src="/img/logo.png" alt="" width={0} height={69}/> 
            <li className={styles.listItem}>Events</li>
            <li className={styles.listItem}>Blog</li>
            <li className={styles.listItem}>Contact</li>
            </ul>
            </div>
            <Link href="/cart" passHref>
            <div className={styles.item}>
            <div className={styles.cart}>
            <Image src="/img/cart.png" alt="" width={30} height={30} />
            <div className={styles.counter}></div>
            </div>
            </div>
            </Link>
            </div>
            );
          }
        };
        
        
        export const setIdEmailToStore = (data) => ({
          type: "STORE_ID_EMAIL",
          payload: data,
        });
        
        
        
        const mapStateToProps = (state) => ({
          state,
        });
        
        const mapDispatchToProps = {
          setIdEmailToStore
        }
        
        
        
        
        export default connect(mapStateToProps, mapDispatchToProps)(Navbar);