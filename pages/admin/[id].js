import Head from "next/head";
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from "react";
import Router, { useRouter } from 'next/router'
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import APIUrls from "../api";
import axios from "axios";
import Image from 'next/image';
import { useAlert } from 'react-alert'
import { setSession } from '../../utils/Actions/index';

// import styles from './nav.module.css'
const Admin = () => {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const dispatch = useDispatch();
  const [price, setPrice] = useState();
  const [qty, setQty] = useState();
  const [variant, setVariant] = useState("black");
  const [companyLogo, setCompanyLogo] = useState('');
  const [addImages, setAddImages] = useState('');
  const [category, setCategory] = useState("");
  const [descriptionList, setDescriptionList] = useState([
    {
      title: "WATER RESISTANT",
      description: "",
      checked: false,
      img: ''
    },
    {
      title: "DURABLE FOR LONGER LIFE",
      description: "",
      checked: true,
      img: ''
    },
    {
      title: "ROUND CORNER FOR SAFETY",
      description: "",
      checked: false,
      img: ''
    },
    {
      title: "EASY TO INSTALL",
      description: "",
      checked: false,
      img: ''
    }
  ]);
  const [subCategory, setSubCategory] = useState("outdoor");
  const [inStock, setInStock] = useState(true);
  const [customVariant, setCustomVariant] = useState();
  const [variantDescription, setVariantDescription] = useState();
  const [displayImage, setDisplayImage] = useState();
  const [variantDisplayImage, setVariantDisplayImage] = useState();
  const [thumbnailList, setThumbnailList] = useState([]);
  const router = useRouter();
  const alert = useAlert()
  const categoryList = useSelector(state => state.categoryList);
  const { id } = router.query
  const [variantList, setVariantList] = useState([
    {
      displayImage: '',
      thumbnailImages: [],
      color: 'White',
      customVariant: '',
      price: '',
      totalStock: 5,
      inStock: true,
      qty: 1,
      description: ''
    }
  ]);
  useEffect(() => {
    if (id && id !== 'add-product') {
      fetchDetails(id)
    }
  }, [user, id]);
  useEffect(() => {
    if (id && id == 'add-product') {
      if (categoryList.length > 0)
        setCategory(categoryList[0].name)
    }
  }, [categoryList, id]);
  useEffect(() => {
    if (!user.is_logged || user.role != 'admin') {
      router.push('/')
      alert.show("Login as Admin", { type: 'info' })
    }
  }, [user])
  const user = useSelector(state => state.user);
  const uploadImage = (index, e, type) => {
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
          if (index !== null) {
            if (type == 'variant-display') {
              let updatedData = variantList.map((data, idx) => {
                if (idx == index) {
                  data.displayImage = response.data.data.url
                }
                return data;
              });
              setVariantList(updatedData);
            } else if (type == 'thumbnail-image') {
              let updatedData = variantList.map((data, idx) => {
                if (idx == index) {
                  data.thumbnailImages = [...data.thumbnailImages, response.data.data.url]
                }
                return data;
              });
              setVariantList(updatedData);
            } else if (type == 'product-description') {
              let updatedData = descriptionList.map((data, idx) => {
                if (idx == index) {
                  data.img = response.data.data.url;
                }
                return data;
              });
              setDescriptionList(updatedData);
            }
          } else if (type == 'company-logo') {
            setCompanyLogo(response.data.data.url);
          } else if (type == 'advertisement-images') {
            setAddImages([...addImages, response.data.data.url]);
          }
          else {
            if (type == 'display') {
              setDisplayImage(response.data.data.url)
            }
          }
        }

      })
      .catch(function (response) {
        //handle error
        alert.show(response.response.statusText, { type: 'error' });
        dispatch(setSession())
      });
  }
  const modifyThumbnails = (parentIndex, idx) => {
    let deleteIndex;
    let updatedData = variantList.map((d, id) => {
      if (id == parentIndex) {
        d.thumbnailImages.map((data, _idx) => {
          if (_idx == idx) {
            deleteIndex = idx;
          }
        });
        d.thumbnailImages.splice(deleteIndex, 1);
      }
      return d;
    });
    console.log(updatedData)
    setVariantList(updatedData);
  }
  const modifyAddImages = (parentIndex) => {
    let deleteIndex;
    let updatedData = addImages.map((d, id) => {
      if (id == parentIndex) {
        deleteIndex = parentIndex;
      }
      return d;
    });
    updatedData.splice(deleteIndex, 1);
    console.log(updatedData)
    setAddImages(updatedData);
  }
  const handleAddProduct = (e) => {
    e.preventDefault();
    console.log(category)
    let updatedVariants = variantList.map((d) => {
      return {
        displayImage: d.displayImage,
        thumbnailImages: d.thumbnailImages,
        color: d.customVariant ? d.customVariant : d.color,
        price: d.price,
        salePrice: d.salePrice,
        totalStock: d.qty,
        inStock: d.inStock,
        qty: d.qty,
        description: d.description,

      }
    });
    if (!title || !description || !displayImage || !subCategory) {
      alert.show('Please fill required fields', { type: 'info' })
    } else if (updatedVariants.length > 0) {
      let error = 0;
      updatedVariants.map((d) => {
        if (!d.displayImage || !d.thumbnailImages || !d.color || !d.price || !d.salePrice || !d.totalStock || !d.qty || !d.description) {
          error = 1;
        }
      });
      if (error == 1) alert.show('Please fill required fields', { type: 'info' })
      else {
        const body = [
          {
            title: title,
            description: description,
            imageUrl: displayImage,
            category: category,
            subCategory: subCategory,
            variants: updatedVariants,
            inStock: inStock,
            isBestSeller: subCategory == "bestseller" ? true : false,
            product_description: {
              logo: companyLogo,
              banner_images: addImages ? addImages : [],
              core_description: descriptionList && descriptionList.length > 0 ? descriptionList.filter(d => d.checked == true) : []
            }
          }
        ]
        console.log(body)
        if (id && id == "add-product") {
          axios.post(APIUrls.create_product, {
            products: body
          }).then(response => {
            console.log(response)
            if (response.status == 200) {
              alert.show("Added", {
                type: 'success'
              });
              router.push('/admin')
            }
          }).catch(error => {
            console.log(error)
          })
        } else {
          axios.put(`${APIUrls.product}/${id}`, {
            title: title,
            description: description,
            imageUrl: displayImage,
            category: category,
            subCategory: subCategory,
            variants: updatedVariants,
            inStock: inStock,
            isBestSeller: subCategory == "bestseller" ? true : false,
            product_description: {
              logo: companyLogo,
              banner_images: addImages ? addImages : [],
              core_description: descriptionList && descriptionList.length > 0 ? descriptionList.filter(d => d.checked == true) : []
            }
          }).then(response => {
            console.log(response)
            if (response.status == 200) {
              alert.show("Updated", {
                type: 'success'
              });
              router.push('/admin')
            }
          }).catch(error => {
            console.log(error.response)
          })
        }
      }
    }
  }
  const dataModify = (idx, value, field) => {
    let updatedData = variantList.map((data, index) => {
      if (index == idx) {
        data[field] = value;
      }
      return data;
    });
    console.log(updatedData)
    setVariantList(updatedData);
  }
  const addVariantItem = () => {
    setVariantList([...variantList, {
      displayImage: '',
      thumbnailImages: [],
      color: 'White',
      customVariant: '',
      price: '',
      totalStock: 5,
      inStock: true,
      qty: 1,
      description: ''
    }])
  }
  const removeVariant = (index) => {
    if (variantList.length != 1) {
      let deleteIndex;
      let updatedData = variantList.map((d, id) => {
        if (id == index) {
          deleteIndex = index;
        }
        return d;
      });
      updatedData.splice(deleteIndex, 1);
      console.log(updatedData)
      setVariantList(updatedData);
    }
  }
  const fetchDetails = () => {
    axios.get(`${APIUrls.product}/${id}`).then(res => {
      console.log("FETCH INDIVIDUAL PRODUCT", res.data)
      let { data } = res.data;
      setTitle(data.title);
      setDescription(data.description);
      setDisplayImage(data.imageUrl);
      setCategory(data.category);
      setSubCategory(data.subCategory);
      setVariantList(data.variants);
      if (data.product_description && data.product_description.core_description) {
        setDescriptionList(data.product_description.core_description)
      }
      if (data.product_description && data.product_description.logo) {
        setCompanyLogo(data.product_description.logo)
      }
      if (data.product_description && data.product_description.banner_images) {
        setAddImages(data.product_description.banner_images)
      }
    }).catch(e => {
      console.log(e.response.statusText)
      alert.show(e.response.statusText, { type: 'error' })
    })
  }
  const handleProductDescription = (field, value, index) => {
    if (descriptionList.length > 0) {
      let data = descriptionList.map((d, idx) => {
        if (index == idx) d[field] = value;
        return d;
      });
      setDescriptionList(data);
    }
  }
  return (
    <>
      <Head>
        <title>Add Product</title>
      </Head>
      <Header />
      <div className='add-product-wrapper row'>
        <form onSubmit={(e) => handleAddProduct(e)}>
          <div className="button-wrapepr col-8">
            <button type="button" className="back-btn col-12 container" onClick={() => Router.push('/admin')}>
              <span>
                <svg width="25" height="25" viewBox="0 0 200 200" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><title /><path d="M100,15a85,85,0,1,0,85,85A84.93,84.93,0,0,0,100,15Zm0,150a65,65,0,1,1,65-65A64.87,64.87,0,0,1,100,165ZM116.5,57.5a9.67,9.67,0,0,0-14,0L74,86a19.92,19.92,0,0,0,0,28.5L102.5,143a9.9,9.9,0,0,0,14-14l-28-29L117,71.5C120.5,68,120.5,61.5,116.5,57.5Z" /></svg>
              </span>
              <span className="ms-2">
                Go Back
              </span>
            </button>
          </div>
          <div className="d-flex justify-content-center flex-column">
            <div className='product-details col-lg-8 col-12'>
              <h3 className="p-0">Product Details</h3>
              <div className="d-flex flex-md-row flex-column bg-blue">
                <div className="col-md-6">
                  <div className='input-wrapper'>
                    <label>Title<span className="required-field">*</span></label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}></input>
                  </div>
                  <div className='input-wrapper'>
                    <label>Description<span className="required-field">*</span></label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className='input-wrapper'>
                    <label>Product Image<span className="required-field">*</span></label>
                    <input type="file" className="p-0" accept="image/png, image/jpeg,image/jpg" style={{ border: 'none' }} onChange={(e) => {
                      uploadImage(null, e, 'display');
                    }}></input>
                  </div>
                  {
                    displayImage && (
                      <div className='input-wrapper'>
                        <Image src={displayImage} width={40} height={40}></Image>
                      </div>
                    )
                  }
                  <div className='input-wrapper'>
                    <label>Category<span className="required-field">*</span></label>
                    <select value={category} onChange={(e) => { setCategory(e.target.value) }}>
                      {
                        categoryList.map(d => {
                          return (<option value={d.name}>{d.name}</option>)
                        })
                      }
                    </select>
                  </div>
                  <div className='input-wrapper'>
                    <label>Sub Category<span className="required-field">*</span></label>
                    <select value={subCategory} onChange={(e) => { setSubCategory(e.target.value) }}>
                      <option value="bestseller">Bestseller</option>
                      <option value="new">New</option>
                      <option value="outdoor">Outdoor Collection</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className='variant-details col-12'>
              <h3 className="p-0">Variant Details</h3>
              <div className="table-wrapper">
                <table className="w-100">
                  <thead>
                    <th></th>
                    <th>Color<span className="required-field">*</span></th>
                    <th>Custom Variant</th>
                    <th>Price<span className="required-field">*</span></th>
                    <th>Sale Price<span className="required-field">*</span></th>
                    <th>Qty<span className="required-field">*</span></th>
                    <th className="th-center">In Stock</th>
                    <th className="th-center">Display Image<span className="required-field">*</span></th>
                    <th className="th-center">Thumbnail Images<span className="required-field">*</span></th>
                    <th>Description<span className="required-field">*</span></th>
                    <th></th>
                  </thead>
                  <tbody>
                    {
                      variantList && variantList.length > 0 ? (
                        variantList.map((d, index) => {
                          return (
                            <tr>
                              <td>
                                <span onClick={() => removeVariant(index)}>
                                  <svg version="1.1" id="Layer_1" height={25} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                    viewBox="0 0 297 297" >
                                    <g>
                                      <g>
                                        <g>
                                          <path d="M150.333,203.762c0-32.35,26.317-58.667,58.667-58.667c6.527,0,12.8,1.087,18.669,3.063l4.882-58.587H47.163
				l14.518,174.21C63.233,282.408,79.091,297,97.784,297h84.147c18.692,0,34.551-14.592,36.103-33.219l0.173-2.081
				c-3.001,0.475-6.075,0.729-9.207,0.729C176.651,262.429,150.333,236.112,150.333,203.762z"/>
                                          <path d="M209,158.714c-24.839,0-45.048,20.209-45.048,45.048c0,24.839,20.209,45.048,45.048,45.048s45.048-20.209,45.048-45.048
				C254.048,178.923,233.839,158.714,209,158.714z M231.101,216.232c2.659,2.66,2.659,6.971,0,9.631
				c-1.33,1.329-3.073,1.994-4.816,1.994c-1.742,0-3.486-0.665-4.816-1.994L209,213.393l-12.47,12.47
				c-1.33,1.329-3.073,1.994-4.816,1.994c-1.742,0-3.486-0.665-4.816-1.994c-2.659-2.66-2.659-6.971,0-9.631l12.47-12.47
				l-12.47-12.47c-2.659-2.66-2.659-6.971,0-9.631c2.66-2.658,6.971-2.658,9.631,0l12.47,12.47l12.47-12.47
				c2.661-2.658,6.972-2.658,9.632,0c2.659,2.66,2.659,6.971,0,9.631l-12.47,12.47L231.101,216.232z"/>
                                          <path d="M112.095,26.102c0-6.883,5.6-12.483,12.483-12.483h30.556c6.884,0,12.484,5.6,12.484,12.483v8.507h13.619v-8.507
				C181.238,11.71,169.528,0,155.135,0h-30.556c-14.392,0-26.102,11.71-26.102,26.102v8.507h13.618V26.102z"/>
                                          <path d="M236.762,63.643c0-8.5-6.915-15.415-15.415-15.415H58.367c-8.5,0-15.415,6.915-15.415,15.415v12.31h193.81V63.643z" />
                                        </g>
                                      </g>
                                    </g>
                                  </svg>
                                </span>
                              </td>
                              <td>
                                <div className='input-wrapper'>
                                  <select value={d.color} onChange={(e) => { dataModify(index, e.target.value, 'color') }}>
                                    {
                                      d.color.toLowerCase() == 'red' || d.color.toLowerCase() == 'white' || d.color.toLowerCase() == 'black' ? (

                                        <>
                                          <option value="White">White</option>
                                          <option value="Black">Black</option>
                                        </>
                                      ) : (<>
                                        <option value={d.color.toLowerCase()}>{d.color}</option>
                                        <option value="White">White</option>
                                        <option value="Black">Black</option>
                                      </>
                                      )
                                    }
                                  </select>
                                </div>
                              </td>
                              <td>
                                <div className='input-wrapper w-small '>
                                  <input type="text" value={d.customVariant} onChange={(e) => dataModify(index, e.target.value, 'customVariant')}></input>
                                </div>
                              </td>
                              <td>
                                <div className='input-wrapper w-small'>
                                  <input type="number" step="0.01" value={d.price} onChange={(e) => dataModify(index, e.target.value, 'price')}></input>
                                </div>
                              </td>
                              <td>
                                <div className='input-wrapper w-small'>
                                  <input type="number" step="0.01" value={d.salePrice} onChange={(e) => dataModify(index, e.target.value, 'salePrice')}></input>
                                </div>
                              </td>
                              <td>
                                <div className='input-wrapper w-small'>
                                  <input type="number" value={d.qty} onChange={(e) => dataModify(index, e.target.value, 'qty')}></input>
                                </div>
                              </td>
                              <td>
                                <div className='input-wrapper align-items-center'>
                                  <input type="checkbox" checked={d.inStock} onChange={(e) => dataModify(index, e.target.checked, 'inStock')}></input>
                                </div>
                              </td>
                              <td className="th-center">
                                <div className='input-wrapper-file align-items-center'>
                                  <input type="file" accept="image/png, image/jpeg,image/jpg"
                                    onChange={(e) => {
                                      uploadImage(index, e, 'variant-display');
                                    }}></input>
                                </div>
                                {
                                  d.displayImage && (
                                    <div className='input-wrapper align-items-center mt-2'>
                                      <Image src={d.displayImage} width={40} height={40}></Image>
                                    </div>
                                  )
                                }
                              </td>
                              <td className="th-center">
                                <div className='input-wrapper-file align-items-center'>
                                  <input type="file" accept="image/png, image/jpeg,image/jpg"
                                    onChange={(e) => {
                                      uploadImage(index, e, 'thumbnail-image');
                                    }}></input>
                                </div>
                                {
                                  d.thumbnailImages && d.thumbnailImages.length > 0 ? (
                                    <div className='input-wrapper-file d-flex flex-row flex-wrap align-items-center mt-2'>
                                      {d.thumbnailImages.map((data, idx) => {
                                        return (
                                          <div className="me-2" style={{ position: 'relative' }}>
                                            <svg className="floating-close" onClick={() => {
                                              modifyThumbnails(index, idx);
                                            }} version="1.1" id="Layer_1" height="16" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                              viewBox="0 0 330 330" >
                                              <g id="XMLID_28_">
                                                <path id="XMLID_29_" d="M165,0C120.926,0,79.492,17.163,48.328,48.327c-64.334,64.333-64.334,169.011-0.002,233.345
		C79.49,312.837,120.926,330,165,330c44.072,0,85.508-17.163,116.672-48.328c64.334-64.334,64.334-169.012,0-233.345
		C250.508,17.163,209.072,0,165,0z M239.246,239.245c-2.93,2.929-6.768,4.394-10.607,4.394c-3.838,0-7.678-1.465-10.605-4.394
		L165,186.213l-53.033,53.033c-2.93,2.929-6.768,4.394-10.607,4.394c-3.838,0-7.678-1.465-10.605-4.394
		c-5.859-5.857-5.859-15.355,0-21.213L143.787,165l-53.033-53.033c-5.859-5.857-5.859-15.355,0-21.213
		c5.857-5.857,15.355-5.857,21.213,0L165,143.787l53.031-53.033c5.857-5.857,15.355-5.857,21.213,0
		c5.859,5.857,5.859,15.355,0,21.213L186.213,165l53.033,53.032C245.104,223.89,245.104,233.388,239.246,239.245z"/>
                                              </g>
                                            </svg>
                                            <Image src={data} width={40} height={40}></Image>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  ) : null
                                }
                              </td>
                              <td>
                                <div className='input-wrapper'>
                                  <textarea value={d.description} style={{ height: '80px' }} onChange={(e) => dataModify(index, e.target.value, 'description')}></textarea>
                                </div>
                              </td>
                              <td>
                                {
                                  index == variantList.length - 1 && (
                                    <span onClick={() => addVariantItem()}>
                                      <svg version="1.1" id="Capa_1" height="20" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                        viewBox="0 0 52 52" >
                                        <path d="M26,0C11.664,0,0,11.663,0,26s11.664,26,26,26s26-11.663,26-26S40.336,0,26,0z M38.5,28H28v11c0,1.104-0.896,2-2,2
	s-2-0.896-2-2V28H13.5c-1.104,0-2-0.896-2-2s0.896-2,2-2H24V14c0-1.104,0.896-2,2-2s2,0.896,2,2v10h10.5c1.104,0,2,0.896,2,2
	S39.604,28,38.5,28z"/>
                                      </svg>
                                    </span>
                                  )
                                }
                              </td>
                            </tr>
                          )
                        })
                      ) : null
                    }
                  </tbody>
                </table>
              </div>
            </div>
            {
              descriptionList.length > 0 && (
                <div className='variant-details col-12'>
                  <h3 className="p-0">Product Description</h3>
                  <div className="mb-5 d-flex">
                    <div className="d-flex flex-column">
                      <label className="mb-2">Company Logo</label>
                      <input type="file" accept="image/png, image/jpeg,image/jpg"
                        onChange={(e) => {
                          uploadImage(null, e, 'company-logo');
                        }}></input>
                      {companyLogo && <div className='input-wrapper-file d-flex flex-row flex-wrap align-items-center mt-2'>
                        <Image src={companyLogo} width={40} height={40}></Image>
                      </div>}
                    </div>
                    <div className="d-flex flex-column">
                      <label className="mb-2">Advertisement Images</label>
                      <input type="file" accept="image/png, image/jpeg,image/jpg"
                        onChange={(e) => {
                          uploadImage(null, e, 'advertisement-images');
                        }}></input>
                      {addImages && addImages.length > 0 ? <div className='input-wrapper-file d-flex flex-row flex-wrap align-items-center mt-2'>
                        {addImages.map((d, index) => {
                          return (<div className="p-0 me-2" style={{ 'position': 'relative' }}><svg className="floating-close p-0" onClick={() => {
                            modifyAddImages(index);
                          }} version="1.1" id="Layer_1" height="16" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 330 330" >
                            <g id="XMLID_28_">
                              <path id="XMLID_29_" d="M165,0C120.926,0,79.492,17.163,48.328,48.327c-64.334,64.333-64.334,169.011-0.002,233.345
C79.49,312.837,120.926,330,165,330c44.072,0,85.508-17.163,116.672-48.328c64.334-64.334,64.334-169.012,0-233.345
C250.508,17.163,209.072,0,165,0z M239.246,239.245c-2.93,2.929-6.768,4.394-10.607,4.394c-3.838,0-7.678-1.465-10.605-4.394
L165,186.213l-53.033,53.033c-2.93,2.929-6.768,4.394-10.607,4.394c-3.838,0-7.678-1.465-10.605-4.394
c-5.859-5.857-5.859-15.355,0-21.213L143.787,165l-53.033-53.033c-5.859-5.857-5.859-15.355,0-21.213
c5.857-5.857,15.355-5.857,21.213,0L165,143.787l53.031-53.033c5.857-5.857,15.355-5.857,21.213,0
c5.859,5.857,5.859,15.355,0,21.213L186.213,165l53.033,53.032C245.104,223.89,245.104,233.388,239.246,239.245z"/>
                            </g>
                          </svg><Image className="me-0" src={d} width={40} height={40}></Image></div>)
                        })}
                      </div> : null}
                    </div>
                  </div>
                  <div className="table-wrapper">
                    <table className="w-100">
                      <thead>
                        <th></th>
                        <th>Quality</th>
                        <th>Description</th>
                        <th className="th-center">Image</th>
                      </thead>
                      <tbody>
                        {
                          descriptionList && descriptionList.length > 0 ? (
                            descriptionList.map((d, index) => {
                              return (
                                <tr>
                                  <td>
                                    <input type='checkbox' checked={d.checked} onChange={e => handleProductDescription('checked', e.target.checked, index)} />
                                  </td>
                                  <td>
                                    {d.title}
                                  </td>
                                  <td>
                                    <textarea className='custom-textarea' value={d.description} onChange={e => handleProductDescription('description', e.target.value, index)}></textarea>
                                  </td>
                                  <td className="th-center d-flex justify-content-center align-items-center">
                                    <div className='input-wrapper-file align-items-center'>
                                      <input type="file" accept="image/png, image/jpeg,image/jpg"
                                        onChange={(e) => {
                                          uploadImage(index, e, 'product-description');
                                        }}></input>
                                    </div>
                                    {d.img && <div className='input-wrapper-file d-flex flex-row flex-wrap align-items-center mt-2'>
                                      <Image src={d.img} width={40} height={40}></Image>
                                    </div>}
                                  </td>
                                </tr>
                              )
                            })
                          ) : null
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            }
          </div>
          <div className="button-wrapepr col-12 justify-content-end d-flex">
            <button type="submit" className="back-btn col-12">
              <span>
                Save
              </span>
            </button>
          </div>
        </form>
      </div >
      <Footer />
    </>
  );
};
export default (Admin);
