import Head from "next/head";
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from "react";
import Router from 'next/router'
import { useAlert } from "react-alert";
import AdminOrder from "../Components/AdminOrder";
import Header from "../Components/Header";
import Footer from "../Components/Footer";


// import styles from './nav.module.css'

const AdminBannerWrapper = () => {
  const user = useSelector(state => state.user);
  const alert = useAlert(); 
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
