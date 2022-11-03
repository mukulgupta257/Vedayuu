import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import APIUrls from '../pages/api';
import Image from 'next/image'
import Button from 'react-bootstrap/Button'
import { useAlert } from 'react-alert'
import { useSelector } from 'react-redux';

export default function AdminPanel() {
  const [show, setShow] = useState(false);
  const user = useSelector(state => state.user);
  const router = useRouter();
  const [productList, setProductList] = useState([]);
  const [allProductList, setAllProductList] = useState([]);
  const [currentID, setCurrentID] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const alert = useAlert();

  //custom pagination vars
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const [pageNumber, setPageNumber] = useState([]);
  const [indexOfAllFirstPage, setIndexOfFirstPage] = useState();
  const [indexOfAllLastPage, setIndexOfLastPage] = useState();
  const [loadingData, setLoadingData] = useState();
  const [initialPage, setInitialPage] = useState(0);
  const [lastPage, setLastPage] = useState(10);
  const [search, setSearch] = useState();

  useEffect(() => {
    if (allProductList && allProductList.length > 0) {
      var indexOfLastPost = currentPage * postsPerPage;
      var indexOfFirstPage = indexOfLastPost - postsPerPage;
      setIndexOfFirstPage(indexOfFirstPage);
      setIndexOfLastPage(indexOfLastPost);

      setProductList(allProductList.slice(indexOfFirstPage, indexOfLastPost));
      for (let i = 1; i <= Math.ceil(allProductList.length / postsPerPage); i++) {
        setPageNumber(...[i])
      }
    }
  }, [currentPage, postsPerPage]);
  useEffect(() => {
    fetchProduct()
  }, [])
  useEffect(() => {
    if(!user.is_logged || user.role!='admin') {
        router.push('/')
        alert.show("Login as Admin",{type:'info'})
    }
}, [user])
  const fetchProduct = () => {
    axios.get(APIUrls.product).then((res) => {
      console.log("PRODUCT LIST", res.data)
      // let productData = [...res.data.data['new'], ...res.data.data['outdoor'], ...res.data.data['bestseller']];
      let productData = [];
        if(res.data.data) {
          Object.entries(res.data.data).map(d => {
            console.log('hereh',...d[1])
            if(d[0]!=='banners') {
              productData.push(...d[1])
            }
          }) 
        }
        console.log(productData)
      setProductList(productData)
      setAllProductList(productData)
      if (res.data.data) {
        setCurrentPage(1);
        var indexOfLastPost = 1 * postsPerPage;
        var indexOfFirstPage = indexOfLastPost - postsPerPage;

        setIndexOfFirstPage(indexOfFirstPage);
        setIndexOfLastPage(indexOfLastPost);
        setAllProductList(productData);
        setProductList(productData.slice(indexOfFirstPage, indexOfLastPost));
        if (productData.length > 0) {
          for (let i = 1; i <= Math.ceil(productData.length / postsPerPage); i++) {
            setPageNumber(...[i])
          }
        } else {
          setPageNumber(1);
        }
      }
    })
  }
  const redirectTo = (path) => {
    router.push(path)
  }
  const handleDeleteModal = (id) => {
    setCurrentID(id)
    handleShow();
  }
  const removeProduct = () => {
    axios.delete(`${APIUrls.product}/${currentID}`).then((res) => {
      alert.show("Deleted", {
        type: 'info'
      });
      fetchProduct();
      handleClose();
    }).catch(e => {
      console.log(e)
    })
  }
  const handleNavigation = (type) => {
    var fpos = initialPage;
    var lpos = lastPage;
    if (type === "prev") {
      if (fpos !== 0) {
        setCurrentPage(fpos);
        setInitialPage(fpos - 9)
        setLastPage(lpos - 9)
      } else {
        setCurrentPage(1);
      }
    } else if (type === "next") {
      if (lpos < pageNumber) {
        // setCurrentPage(lpos+1);
        setCurrentPage(lpos);
        setInitialPage(fpos + 9)
        setLastPage(lpos + 9)
      }
    }
  }

  return (
    <div className='admin-wrapper d-flex justify-content-center flex-column'>
      <div className='button-wrapper justify-content-end d-flex mb-4 mt-4'>
        <button onClick={() => router.push('/admin/add-product')}>Add Product</button>
        <button className='ms-2' onClick={() => router.push('/admin/banner')}>View Banners</button>
        <button className='ms-2' onClick={() => router.push('/admin/banner/category')}>View Categories</button>
        <button className='ms-2' onClick={() => router.push('/admin/banner/order')}>View Orders</button>
      </div>
      <div className='product mt-4 d-flex justify-content-center table-wrapper flex-column'>
        <table className='w-100'>
          <thead>
            <th></th>
            <th></th>
            <th>Name | Description</th>
            <th className='th-center'>category</th>
            <th className='th-center'>Sub Category</th>
            <th className='th-center'>In Stock</th>
            <th className='th-center'>Is Bestseller</th>
            <th>Variants</th>
          </thead>
          <tbody>
            {
              productList && productList.length > 0 ? (
                productList.map((d, index) => {
                  return (
                    <tr>
                      <td>
                        <span onClick={() => redirectTo(`/admin/${d._id}`)}>
                          <svg version="1.1" id="Layer_1" height="20px" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 490.584 490.584">
                            <g>
                              <g>
                                <path d="M100.911,419.404l123.8-51c3.1-2.1,6.2-4.2,8.3-6.2l203.9-248.6c6.2-9.4,5.2-21.8-3.1-29.1l-96.8-80.1
			c-8-5.9-20.3-6.8-28.1,3.1l-204.9,248.5c-2.1,3.1-3.1,6.2-4.2,9.4l-26,132.1C72.511,420.104,90.611,424.004,100.911,419.404z
			 M326.611,49.004l65.5,54.1l-177.7,217.1l-64.9-53.7L326.611,49.004z M133.411,306.904l44.4,36.8l-57.2,23.6L133.411,306.904z"/>
                                <path d="M469.111,448.504h-349.5c0,0-72.5,3.4-75.2-15.2c0-1-1.8-5.6,7.6-17c7.3-9.4,6.2-21.8-2.1-29.1
			c-9.4-7.3-21.8-6.2-29.1,2.1c-19.8,23.9-25,44.7-15.6,63.5c25.5,47.5,111.3,36.3,115.4,37.3h348.5c11.4,0,20.8-9.4,20.8-20.8
			C490.011,457.804,480.611,448.504,469.111,448.504z"/>
                              </g>
                            </g>
                          </svg>
                        </span>
                      </td>
                      <td>
                        <span onClick={() => handleDeleteModal(d._id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            width="40px" height="40px" viewBox="0 0 52 52" enable-background="new 0 0 52 52">
                            <g>
                              <path d="M45.5,10H33V6c0-2.2-1.8-4-4-4h-6c-2.2,0-4,1.8-4,4v4H6.5C5.7,10,5,10.7,5,11.5v3C5,15.3,5.7,16,6.5,16h39
		c0.8,0,1.5-0.7,1.5-1.5v-3C47,10.7,46.3,10,45.5,10z M23,7c0-0.6,0.4-1,1-1h4c0.6,0,1,0.4,1,1v3h-6V7z"/>
                              <path d="M41.5,20h-31C9.7,20,9,20.7,9,21.5V45c0,2.8,2.2,5,5,5h24c2.8,0,5-2.2,5-5V21.5C43,20.7,42.3,20,41.5,20z
		 M23,42c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1V28c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1V42z M33,42c0,0.6-0.4,1-1,1h-2
		c-0.6,0-1-0.4-1-1V28c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1V42z"/>
                            </g>
                          </svg>
                        </span>
                      </td>
                      <td>
                        <div className='item-wrapper'>
                          <div className='img-wrapper'>
                            <Image src={d.imageUrl} height={50} width={50}></Image>
                          </div>
                          <div className='text-wrapper'>
                            <p><strong className='p-0'>{d.title}</strong></p>
                            <p>{d.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className='th-center'>{d.category}</td>
                      <td className='th-center'>{d.subCategory}</td>
                      <td className='th-center'>{d.inStock ? "Yes" : "No"}</td>
                      <td className='th-center'>{d.isBestSeller ? "Yes" : "No"}</td>
                      <td>
                        {
                          d.variants.length > 0 ? (
                            d.variants.map((data) => {
                              return (
                                <div className='item-wrapper' style={{minHeight:'50px'}}>
                                  <div className='img-wrapper'>
                                    {
                                      data.displayImage ? <Image src={data.displayImage} height={50} width={50}></Image> : (
                                        <span>No preview available</span>
                                      )
                                    }
                                  </div>
                                  <div className='text-wrapper'>
                                    <p><strong className='p-0'>{data.color}</strong></p>
                                    <p>{data.description}</p>
                                  </div>
                                </div>
                              )
                            })
                          ) : null
                        }
                      </td>
                    </tr>
                  )
                })
              ) : <tr>
                <td className="th-center" colspan="8">No data</td></tr>
            }
          </tbody>
        </table>
        {
          search ? "" :
            (
              <div className="customer-table-pagination d-none d-md-block">
                <div className="table-pagination-row d-flex justify-content-center">
                  <div className="table-pagination-number">
                    {
                      new Array(pageNumber).fill("").map((val, index) => {
                        return (
                          <Button key={index}
                            className={(index + 1) === currentPage ? "btn-number active" : "btn-number"} variant="link"
                            onClick={() => {
                              if (index === initialPage) {
                                handleNavigation("prev");
                              } else if (index === lastPage - 1) {
                                handleNavigation("next");
                              } else {
                                setCurrentPage(index + 1)
                              }
                            }}
                            disabled={loadingData}>
                            {index + 1}
                          </Button>
                        )
                      }).slice(initialPage, lastPage)
                    }
                  </div>
                </div>
              </div>
            )
        }
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Remove</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => removeProduct()}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
