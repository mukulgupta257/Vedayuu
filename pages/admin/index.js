import Head from "next/head";
import { useDispatch, useSelector } from 'react-redux';
import AdminPanel from "../../Components/AdminPanel";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import React, { useEffect } from "react";
import Router from 'next/router'


// import styles from './nav.module.css'

const Admin = () => {
  return (
    <>
      <Head>
        <title>Admin Panel</title>
      </Head>
      <Header />
      <AdminPanel />
      <Footer />
    </>
  );
};
export default (Admin);
