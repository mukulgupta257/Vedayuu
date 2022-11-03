import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import APIUrls from '../pages/api';
import Image from 'next/image'
import Button from 'react-bootstrap/Button'
import { useAlert } from 'react-alert'
import { useDispatch } from 'react-redux';
import { setCategoryList } from '../utils/Actions';

export default function AdminCategory() {
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
  const [bannerTitle, setBannerTitle] = useState('');
  const [clickedURL, setClickedURL] = useState('');
  const [itemList, setItemList] = useState([]);
  const [category, setCategory] = useState('home');
  const [displayImage, setDisplayImage] = useState();
  const [displayImageDesktop, setDisplayImageDesktop] = useState();
  const [isActive, setIsActive] = useState(true);
  useEffect(() => {
    fetchCategory();
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
  const dispatch = useDispatch();

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
  const fetchCategory = () => {
    axios.get(APIUrls.categoryList).then((res) => {
      console.log("CATEGORY LIST", res.data)
      let productData = res.data.data
      if (res.data.data) {
        var indexOfLastPost = 1 * postsPerPage;
        var indexOfFirstPage = indexOfLastPost - postsPerPage;
        setCurrentPage(1);
        setIndexOfFirstPage(indexOfFirstPage);
        setIndexOfLastPage(indexOfLastPost);
        setAllProductList(productData);
        setProductList(productData.slice(indexOfFirstPage, indexOfLastPost));
        dispatch(setCategoryList({ categoryList: res.data.data }));
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
    axios.delete(`${APIUrls.categoryList}/${currentID}`).then((res) => {
      alert.show("Deleted", {
        type: 'info'
      });
      fetchCategory();
      handleClose();
    }).catch(e => {
      console.log(e)
    })
  }
  const uploadImage = (e, type) => {
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
          if (type == 'mobile')
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
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!bannerTitle || !title || !category || !displayImage || !displayImageDesktop) {
      alert.show('Please fill required fields', { type: 'info' })
    } else {
      axios.post(APIUrls.banner_create, {
        banner: [
          {
            title: bannerTitle,
            imageURL: displayImage,
            desktopURL: displayImageDesktop,
            category: title,
            isActive: isActive,
            clickedURL: ''
          }
        ]
      }).then((res) => {
        // alert.show("Added", {
        //   type: 'success'
        // });
        axios.post(APIUrls.add_category, {
          categoryList: [
            {
              // name: title.split(' ').join(''),
              name: title,
              isActive: isActive,
            }
          ]
        }).then((res) => {
          alert.show("Added", {
            type: 'success'
          });
          fetchCategory();
          setBannerModal(false);
        }).catch(e => console.log(e))
      }).catch(e => console.log(e))
    }
  }
  const handleActive = (e, id) => {
    e.preventDefault();
    axios.put(`${APIUrls.categoryList}/update/${id}`, {
      isActive: e.target.checked
    }).then((res) => {
      alert.show("Updated", {
        type: 'info'
      });
      fetchCategory();
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
    const urlParams = encodeURIComponent(JSON.stringify(["outdoor", "new", "bestseller"]));
    const array = [value];
    const url = `?category=${JSON.stringify(array)}&subCategory=${urlParams}`
    axios.get(`${APIUrls.product}/${url}`).then((res) => {
      console.log("product list", res.data)
      if (res.data.data) {
        let { data } = res.data;
        var bestseller = data['bestseller'] ? data['bestseller'] : [];
        var outdoor = data['outdoor'] ? data['outdoor'] : [];
        var newData = data['new'] ? data['new'] : [];

        let array = [...bestseller, ...outdoor, ...newData]
        setItemList(array);
        if (array.length > 0) setClickedURL(`/product/${array[0].category}/${array[0]._id}`);
      }
    })
  }
  return (
    <div className='admin-wrapper d-flex justify-content-center flex-column'>
      <div className='button-wrapper justify-content-end d-flex mb-4 mt-4'>
        <button onClick={() => setBannerModal(true)}>Add Category</button>
        <button className='ms-2' onClick={() => router.push('/admin/banner')}>View Banners</button>
        <button className='ms-2' onClick={() => router.push('/admin')}>View Products</button>
        <button className='ms-2' onClick={() => router.push('/admin/banner/order')}>View Orders</button>
      </div>
      <div className='product mt-4 d-flex justify-content-center table-wrapper flex-column'>
        <table className='w-100'>
          <thead>
            <th></th>
            <th className='th-center'>Category</th>
            <th className='th-center'>IS ON MENU</th>
            <th className='th-center'></th>
          </thead>
          <tbody>
            {
              productList && productList.length > 0 ? (
                productList.map((d, index) => {
                  return (
                    <tr>
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
                      <td className='th-center d-flex justify-content-center'>
                        <div className='item-wrapper align-items-center'>
                          <div className='text-wrapper'>
                            <p><strong className='p-0'>{d.name}</strong></p>
                          </div>
                        </div>
                      </td>
                      <td className='th-center'>
                        <input type="checkbox" checked={d.isActive} onChange={(e) => handleActive(e, d._id)}></input>
                      </td>
                      <td className='th-center'>
                        <div className='button-wrapper'>
                          <button className='ms-2' onClick={() => router.push('/admin/add-product')}>Add Products</button>
                        </div>
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
        <Modal.Body>Do you really want to delete this category?</Modal.Body>
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
          <Modal.Title>Category Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='modal-form'>
            <form onSubmit={(e) => handleAddCategory(e)}>
              <div className='input-wrapper'>
                <label>Category Name<span className='required-field'>*</span></label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}></input>
              </div>
              <div className='input-wrapper'>
                <label>Banner Title<span className='required-field'>*</span></label>
                <input type="text" value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)}></input>
              </div>
              <div className='input-wrapper'>
                <label>Banner Image (Mobile)<span className='required-field'>*</span></label>
                <input type="file" className='p-0' accept="image/png, image/jpeg,image/jpg" style={{ border: 'none' }} onChange={(e) => {
                  uploadImage(e, 'mobile');
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
                  uploadImage(e, 'desktop');
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
                <input type="submit" value="Add Category"></input>
              </div>
            </form>
          </div>
        </Modal.Body>

      </Modal>
    </div>
  )
}
