import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Router from 'next/router';
import CardWrapper from '../Components/CardWrapper'
import Header from '../Components/Header'
import itemImg from '../public/assets/images/item.jpeg';
import APIUrls from './api';
const _ = require('lodash');

export default function Search() {
    const [cardList, setCardList] = useState({});
    const [search, setSearch] = useState('');
    const fetchProducts = (function (value) {
        axios.get(`${APIUrls.search_product}/${value}`).then((res) => {
            setCardList(res.data.data);
        })
    });
    const redirectTo = (path) => {
        Router.push(path)
    }
    return (
        <>
            <Head><title>Search Product</title></Head>
            <div className='search-wrapper container'>
                <div className='close-wrapper'>
                    <svg width="50" height="50"
                        onClick={() => redirectTo('/')}
                        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0" />
                            <path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" /></g>
                        </g>
                    </svg>
                </div>
                <div className='search-box'>
                    <input type="text" value={search} onChange={async (e) => {
                        setSearch(e.target.value);
                        if (e.target.value) await fetchProducts(e.target.value);
                    }} placeholder="Search..." className='input-search'></input>
                    <svg className="floating-search" xmlns="http://www.w3.org/2000/svg" width="35.997" height="36.004" viewBox="0 0 35.997 36.004">
                        <path id="Icon_awesome-search" data-name="Icon awesome-search" d="M35.508,31.127l-7.01-7.01a1.686,1.686,0,0,0-1.2-.492H26.156a14.618,14.618,0,1,0-2.531,2.531V27.3a1.686,1.686,0,0,0,.492,1.2l7.01,7.01a1.681,1.681,0,0,0,2.384,0l1.99-1.99a1.7,1.7,0,0,0,.007-2.391Zm-20.883-7.5a9,9,0,1,1,9-9A8.995,8.995,0,0,1,14.625,23.625Z" />
                    </svg>

                </div>
            </div>
            <div className='container'>
                <CardWrapper title="" category={'all'} cardList={cardList ? cardList : []} />
            </div>
        </>
    )
}
