import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/global.scss';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from '../utils/Store/index';
import { useEffect, useState } from "react";
import { setCategoryList, setSession, setShipRocketToken, setUserInfo } from '../utils/Actions';
import Head from 'next/head'
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
import setAuthorizationToken from '../utils/AuthHeaders';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import Favicon from 'react-favicon'
import axios from 'axios';
import APIUrls from './api';
import { render } from 'react-dom'
import { SHIPROCKET_PASSWORD, SHIPROCKET_USERNAME } from '../credentials';
import Drawer from '../Components/Drawer';
const options = {
  position: positions.TOP_CENTER,
  timeout: 3000,
  type: {
    INFO: 'info',
    SUCCESS: 'success',
    ERROR: 'error'
  },
  offset: '30px',
  transition: transitions.SCALE
}
function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  // console.log = function () { }
  useEffect(() => {
    getCategoryList();
    verifyToken();
  }, [])

  const verifyToken = () => {
    const cookie = getCookie('token');
    const username = getCookie('username');
    const email = getCookie('email');
    const cart = getCookie('cart');
    const role = getCookie('role');
    const shippingPayLoad = getCookie('shipping_address');
    let shipping_address = [];
    if (shippingPayLoad) {
      shipping_address = JSON.parse(shippingPayLoad).data
    }

    if (cookie !== undefined && cookie !== "undefined") {
      //check token API
      setAuthorizationToken(`Bearer ${cookie}`, null, null, false);
      if (cart !== undefined && cart !== "undefined") {
        store.dispatch(setUserInfo(
          {
            cookie,
            role,
            username,
            email,
            shipping_address,
            cart: JSON.parse(cart).data,
            is_logged: (cookie) == 'undefined' || cookie == undefined ? false : true
          }));
      } else {
        store.dispatch(setUserInfo(
          {
            cookie,
            username,
            role,
            email,
            shipping_address,
            is_logged: (cookie) == 'undefined' || cookie == undefined ? false : true
          }));
      }
      setLoading(false);
    } else if (cart !== undefined && cart !== "undefined") {
      setLoading(false);
      if (cart !== undefined && cart !== "undefined") {
        store.dispatch(setUserInfo(
          {
            cart: JSON.parse(cart).data,
          }));
      }
    } else {
      setLoading(false);
    }

  }
  const getCookie = (cName) => {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split('; ');
    let res;
    cArr.forEach(val => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res;
  }
  const getCategoryList = () => {
    axios.get(APIUrls.categoryList).then((res) => {
      console.log("CATEGORY LIST _app.js", res.data)
      let categoryList = res.data.data;
      store.dispatch(setCategoryList({ categoryList }));
    })
  }
  return (
    <>
      <Head>
        <html lang={'en'} />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
      </Head>
      <Provider store={store}>
        {loading ? "Loading..." : <AlertProvider template={AlertTemplate} {...options}>
          {/* <Favicon url='https://cdn.winecap.com/favicon.ico' /> */}
          <Component {...pageProps} />
          <Drawer/>
        </AlertProvider>}
      </Provider>
    </>
  )
}

export default MyApp
