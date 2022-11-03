import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import CardWrapper from '../../../Components/CardWrapper';
import Footer from '../../../Components/Footer';
import Header from '../../../Components/Header';
import ItemDetails from '../../../Components/ItemDetails';
import itemImg from '../../../public/assets/images/item.jpeg';
import axios from 'axios';
import APIUrls from '../../api';
import ProductDescription from '../../../Components/ProductDescription';
export default function Product() {
  const router = useRouter();
  const [cardList, setCardList] = useState({});
  const { category } = router.query;
  const [productDescription, setProductDescription] = useState('');
  const [variants, setVariants] = useState('');
  const [title, setTitle] = useState('');
  useEffect(() => {
    if (router.query.category) {
      fetchProducts();
    }
  }, [router])
  const fetchProducts = () => {
    const urlParams = encodeURIComponent(JSON.stringify(["outdoor", "new", "bestseller"]));
    let array = [];
    array.push(category)
    console.log(array)
    if (array) {
      const url = `?category=${JSON.stringify(array)}&subCategory=${urlParams}`
      axios.get(`${APIUrls.product}/${url}`).then((res) => {
        console.log("product list", res.data)
        setCardList(res.data.data)
      })
    }
  }
  return (
    <>
      <Head>
        <title>
          {router.query.name}
        </title>
      </Head>
      <Header />
      <ItemDetails
        setProductDescription={(data) => setProductDescription(data)}
        setVariantsData={(data) => setVariants(data)}
        setTitle={d => setTitle(d)}
      />
      <CardWrapper title="Related Products" category={'new'} cardList={cardList && cardList['new']} />
      <ProductDescription data={productDescription} variants_data={variants} title={title} />
      <Footer />
    </>
  )
}
