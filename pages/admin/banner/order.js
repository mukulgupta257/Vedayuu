import Head from "next/head";
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from "react";
import Router from 'next/router'
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import AdminBanner from "../../../Components/AdminBanner";
import { useAlert } from "react-alert";
import AdminCategory from "../../../Components/AdminCategory";
import AdminOrder from "../../../Components/AdminOrder";


// import styles from './nav.module.css'

const AdminBannerWrapper = () => {
  const user = useSelector(state => state.user);
  const alert = useAlert();
  useEffect(() => {
    if(!user.is_logged || user.role!='admin') {
        Router.push('/')
        alert.show("Login as Admin",{type:'info'})
    }
  }, [user])  
  return (
    <>
      <Head>
        <title>Admin Panel</title>
      </Head>
      <Header />
      <AdminOrder />
      <Footer />
    </>
  );
};
export default (AdminBannerWrapper);
