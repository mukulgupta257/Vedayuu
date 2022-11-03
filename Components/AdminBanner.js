import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import APIUrls from '../pages/api';
import Image from 'next/image'
import Button from 'react-bootstrap/Button'
import { useAlert } from 'react-alert'

export default function AdminBanner() {
  const [show, setShow] = useState(false);
  const alert = useAlert();
  const router = useRouter();
  const [productList, setProductList] = useState([]);
  const [allProductList, setAllProductList] = useState([]);
  const [currentID, setCurrentID] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [bannerModal, setBannerModal] = useState(false);
  const [title, setTitle] = useState('');
  const [clickedURL, setClickedURL] = useState('');
  const [itemList, setItemList] = useState([]);
  const [category, setCategory] = useState('home');
  const [displayImage, setDisplayImage] = useState();
  const [displayImageDesktop, setDisplayImageDesktop] = useState();
  const [isActive, setIsActive] = useState(true);
  const [categoryList, setCategoryList] = useState(
    ['seating', 'beds', 'storage', 'kids', 'tables', 'bar', 'etcetra', 'gifting', 'home']
  )
  useEffect(() => {
    fetchBanners();
    // handleCategoryChange('home');
  }, []);
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
  const fetchBanners = () => {
    axios.get(APIUrls.banner).then((res) => {
      console.log("BANNER LIST", res.data)
      let productData = res.data.data
      if (res.data.data) {
        var indexOfLastPost = 1 * postsPerPage;
        var indexOfFirstPage = indexOfLastPost - postsPerPage;
        setCurrentPage(1);
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
    axios.delete(`${APIUrls.banner}/${currentID}`).then((res) => {
      alert.show("Deleted", {
        type: 'info'
      });
      fetchBanners();
      handleClose();
    }).catch(e => {
      console.log(e)
    })
  }
  const uploadImage = (e,type) => {
    console.log("FILES TO BE UPLOADED", e.target.files[0])
    var bodyFormData = new FormData();
    bodyFormData.append("file", e.target.files[0]);
    axios({
      method: "post",
      url: APIUrls.upload_img,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        console.log(response);

        if (response.status == 200) {
          if(type=='mobile')
          setDisplayImage(response.data.data.url)
          else
          setDisplayImageDesktop(response.data.data.url)
        }

      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  }
  const handleAddBanner = (e) => {
    e.preventDefault();
    if(!title || !category || !displayImage || !displayImageDesktop) {
      alert.show('Please fill required fields', { type: 'info' })
    } else {
      axios.post(APIUrls.banner_create, {
        banner: [
          {
            title: title,
            imageURL: displayImage,
            desktopURL: displayImageDesktop,
            category: category,
            isActive: isActive,
            clickedURL: clickedURL ? clickedURL : null
          }
        ]
      }).then((res) => {
        alert.show("Added", {
          type: 'success'
        });
        fetchBanners();
        setBannerModal(false);
      }).catch(e => console.log(e))
    }
  }
  const handleActive = (e, id) =>  {
    e.preventDefault();
    axios.put(`${APIUrls.banner}/update/${id}`, {
      isActive: e.target.checked
    }).then((res) => {
      alert.show("Updated", {
        type: 'info'
      });
      fetchBanners();
    }).catch(e => console.log(e))
  }
  const handleFillForm = (item) => {
    setCurrentID(item._id);
    setTitle(item.title);
    setCategory(item.category);
    setDisplayImage(item.displayImage);
    setIsActive(item.isActive);
    setBannerModal(true);
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
const handleCategoryChange = (value) => {
  setCategory(value)
  setClickedURL(null);
    const urlParams =  encodeURIComponent(JSON.stringify(["outdoor", "new", "bestseller"]));
    const array = [value];
    const url = `?category=${JSON.stringify(array)}&subCategory=${urlParams}`
    axios.get(`${APIUrls.product}/${url}`).then((res) => {
      console.log("product list",res.data)
      if(res.data.data) {
        let {data} = res.data; 
        var bestseller = data['bestseller']?data['bestseller']:[];
        var outdoor = data['outdoor']?data['outdoor']:[];
        var newData = data['new']?data['new']:[];

        let array = [...bestseller,...outdoor,...newData]
        setItemList(array);
        if(array.length>0) setClickedURL(`/product/${array[0].category}/${array[0]._id}`); 
      }
    })
}
  return (
    <div className='admin-wrapper d-flex justify-content-center flex-column'>
      <div className='button-wrapper justify-content-end d-flex mb-4 mt-4'>
        <button onClick={() => setBannerModal(true)}>Add Banner</button>
        <button className='ms-2' onClick={() => router.push('/admin')}>View Products</button>
        <button className='ms-2' onClick={() => router.push('/admin/banner/category')}>View Categories</button>
        <button className='ms-2' onClick={() => router.push('/admin/banner/order')}>View Orders</button>
      </div>
      <div className='product mt-4 d-flex justify-content-center table-wrapper flex-column'>
        <table className='w-100'>
          <thead>
            <th></th>
            <th>Banner</th>
            <th>Mobile View</th>
            <th>Desktop View</th>
            <th className='th-center'>category</th>
            <th>Redirect URL</th>
            <th className='th-center'>Is Active</th>
          </thead>
          <tbody>
            {
              productList && productList.length > 0 ? (
                productList.map((d, index) => {
                  return (
                    <tr>
                      {/* <td>
                        <span onClick={() => handleFillForm(d)}>
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
                      </td> */}
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
                        <div className='item-wrapper align-items-start'>
                          <div className='text-wrapper'>
                            <p><strong className='p-0'>{d.title}</strong></p>
                          </div>
                        </div>
                      </td>
                      <td>
                      <div className='item-wrapper align-items-start'>
                          <div className='img-wrapper'>
                            {
                              d.imageURL ? (<Image src={d.imageURL} height={50} width={50}></Image>): '-'
                            }
                          </div>
                        </div>
                      </td>
                      <td>
                      <div className='item-wrapper align-items-start'>
                          <div className='img-wrapper'>
                            {
                              d.desktopURL ?(<Image src={d.desktopURL} height={50} width={50}></Image>):'-'
                            }
                          </div>
                        </div>
                      </td>
                      <td className='th-center'>{d.category}</td>
                      <td>{d.clickedURL}</td>
                      <td className='th-center'>
                        <input type="checkbox" checked={d.isActive} onChange={(e) => handleActive(e, d._id)}></input>
                      </td>
                    </tr>
                  )
                })
              ) : <tr>
                <td colspan="7" className="th-center">No data</td></tr>
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
        <Modal.Body>Do you really want to delete this banner?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => removeProduct()}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={bannerModal} onHide={() => setBannerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Banner Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='modal-form'>
            <form onSubmit={(e) => handleAddBanner(e)}>
              <div className='input-wrapper'>
                <label>Title<span className='required-field'>*</span></label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}></input>
              </div>
              <div className='input-wrapper'>
                <label>Category<span className='required-field'>*</span></label>
                <select value={category} onChange={(e) => { handleCategoryChange(e.target.value) }}>
                  <option value="seating">Seating</option>
                  <option value="beds">Beds</option>
                  <option value="storage">Storage</option>
                  <option value="kids">Kids</option>
                  <option value="tables">Tables</option>
                  <option value="bar">Bar</option>
                  <option value="gifting">Gifting</option>
                  <option value="home">Landing Page</option>
                </select>
              </div>
              <div className='input-wrapper'>
                <label>Redirect URL</label>
                <select value={clickedURL} onChange={(e) => { setClickedURL(e.target.value) }}>
                  {
                    itemList && itemList.length>0?(
                      itemList.map(d => <option value={`/product/${d.category}/${d._id}`}>{d.title}</option>)
                    ):null
                  }
                </select>
              </div>
              <div className='input-wrapper'>
                <label>Banner Image (Mobile)<span className='required-field'>*</span></label>
                <input type="file" className='p-0' accept="image/png, image/jpeg,image/jpg" style={{ border: 'none' }} onChange={(e) => {
                  uploadImage(e,'mobile');
                }} ></input>
              </div>
              {
                displayImage && (
                  <div className='input-wrapper'>
                    <Image src={displayImage} width={40} height={40}></Image>
                  </div>
                )
              }
              <div className='input-wrapper'>
                <label>Banner Image (Desktop)<span className='required-field'>*</span></label>
                <input type="file" className='p-0' accept="image/png, image/jpeg,image/jpg" style={{ border: 'none' }} onChange={(e) => {
                  uploadImage(e,'desktop');
                }} ></input>
              </div>
              {
                displayImageDesktop && (
                  <div className='input-wrapper'>
                    <Image src={displayImageDesktop} width={40} height={40}></Image>
                  </div>
                )
              }
              <div className='input-wrapper'>
                <label>Active</label>
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} ></input>
              </div>
              <div className='input-wrapper'>
                <label></label>
                <input type="submit" value="Add Banner"></input>
              </div>
            </form>
          </div>
        </Modal.Body>

      </Modal>
    </div>
  )
}
