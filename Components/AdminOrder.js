import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import APIUrls from "../pages/api";
import Image from "next/image";
import Button from "react-bootstrap/Button";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { SHIPROCKET_PASSWORD, SHIPROCKET_USERNAME } from "../credentials";
import { setUserInfo } from "../utils/Actions";
import { E_COM_PASSWORD, E_COM_USERNAME } from "../env";
import setAuthorizationToken from "../utils/AuthHeaders";
import { generateInvoice } from "../utils/Pdf/helper";
export default function AdminOrder() {
  const [show, setShow] = useState(false);
  const user = useSelector((state) => state.user);
  const alert = useAlert();
  const router = useRouter();
  const [productList, setProductList] = useState([]);
  const [allProductList, setAllProductList] = useState([]);
  const [APIToken, setAPIToken] = useState();
  const [currentID, setCurrentID] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [bannerModal, setBannerModal] = useState(false);
  const [title, setTitle] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [isTrackingModal, setIsTrackingModal] = useState(false);
  const [bannerTitle, setBannerTitle] = useState("");
  const [xmlData, setXMLData] = useState("");
  const [currentOrderAPI, setCurrentOrderAPI] = useState("");
  const [currentAWB, setCurrenctAWB] = useState("");
  const [clickedURL, setClickedURL] = useState("");
  const [itemList, setItemList] = useState([]);
  const [category, setCategory] = useState("home");
  const [displayImage, setDisplayImage] = useState();
  const [displayImageDesktop, setDisplayImageDesktop] = useState();
  const [isActive, setIsActive] = useState(true);
  useEffect(async () => {
    // await fetchToken();
    await fetchDbOrder();
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
      for (
        let i = 1;
        i <= Math.ceil(allProductList.length / postsPerPage);
        i++
      ) {
        setPageNumber(...[i]);
      }
    }
  }, [currentPage, postsPerPage]);
  const getCookie = (cName) => {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split("; ");
    let res;
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
  };
  const fetchOrder = () => {
    axios
      .post(APIUrls.order, {
        email: user.role == "admin" ? "" : getCookie("email"),
      })
      .then((res) => {
        console.log("ORDER LIST", res.data);
        let productData = res.data.data;
        if (res.data.data) {
          var indexOfLastPost = 1 * postsPerPage;
          var indexOfFirstPage = indexOfLastPost - postsPerPage;
          setCurrentPage(1);
          setIndexOfFirstPage(indexOfFirstPage);
          setIndexOfLastPage(indexOfLastPost);
          setAllProductList(productData);
          setProductList(productData.slice(indexOfFirstPage, indexOfLastPost));
          if (productData.length > 0) {
            console.log("AVAIL DATA", productData);
            for (
              let i = 1;
              i <= Math.ceil(productData.length / postsPerPage);
              i++
            ) {
              setPageNumber(...[i]);
            }
          } else {
            setPageNumber(1);
          }
        }
      });
  };
  const redirectTo = (path) => {
    router.push(path);
  };
  const handleDeleteModal = (id) => {
    setCurrentID(id);
    handleShow();
  };
  const removeProduct = () => {
    axios
      .delete(`${APIUrls.categoryList}/${currentID}`)
      .then((res) => {
        alert.show("Deleted", {
          type: "info",
        });
        fetchOrder();
        handleClose();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const uploadImage = (e, type) => {
    console.log("FILES TO BE UPLOADED", e.target.files[0]);
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
          if (type == "mobile") setDisplayImage(response.data.data.url);
          else setDisplayImageDesktop(response.data.data.url);
        }
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  };
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (
      !bannerTitle ||
      !title ||
      !category ||
      !displayImage ||
      !displayImageDesktop
    ) {
      alert.show("Please fill required fields", { type: "info" });
    } else {
      axios
        .post(APIUrls.banner_create, {
          banner: [
            {
              title: bannerTitle,
              imageURL: displayImage,
              desktopURL: displayImageDesktop,
              category: title,
              isActive: isActive,
              clickedURL: `/category/${title}`,
            },
          ],
        })
        .then((res) => {
          // alert.show("Added", {
          //   type: 'success'
          // });
          axios
            .post(APIUrls.add_category, {
              categoryList: [
                {
                  name: title.split(" ").join(""),
                  isActive: isActive,
                },
              ],
            })
            .then((res) => {
              alert.show("Added", {
                type: "success",
              });
              fetchOrder();
              setBannerModal(false);
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    }
  };
  const handleActive = (e, id) => {
    e.preventDefault();
    axios
      .put(`${APIUrls.categoryList}/update/${id}`, {
        isActive: e.target.checked,
      })
      .then((res) => {
        alert.show("Updated", {
          type: "info",
        });
        fetchOrder();
      })
      .catch((e) => console.log(e));
  };
  const handleFillForm = (item) => {
    setCurrentID(item._id);
    setTitle(item.title);
    setCategory(item.category);
    setDisplayImage(item.displayImage);
    setIsActive(item.isActive);
    setBannerModal(true);
  };
  const handleNavigation = (type) => {
    var fpos = initialPage;
    var lpos = lastPage;
    if (type === "prev") {
      if (fpos !== 0) {
        setCurrentPage(fpos);
        setInitialPage(fpos - 9);
        setLastPage(lpos - 9);
      } else {
        setCurrentPage(1);
      }
    } else if (type === "next") {
      if (lpos < pageNumber) {
        // setCurrentPage(lpos+1);
        setCurrentPage(lpos);
        setInitialPage(fpos + 9);
        setLastPage(lpos + 9);
      }
    }
  };
  const handleCategoryChange = (value) => {
    setCategory(value);
    const urlParams = encodeURIComponent(
      JSON.stringify(["outdoor", "new", "bestseller"])
    );
    const array = [value];
    const url = `?category=${JSON.stringify(array)}&subCategory=${urlParams}`;
    axios.get(`${APIUrls.product}/${url}`).then((res) => {
      console.log("product list", res.data);
      if (res.data.data) {
        let { data } = res.data;
        var bestseller = data["bestseller"] ? data["bestseller"] : [];
        var outdoor = data["outdoor"] ? data["outdoor"] : [];
        var newData = data["new"] ? data["new"] : [];

        let array = [...bestseller, ...outdoor, ...newData];
        setItemList(array);
        if (array.length > 0)
          setClickedURL(`/product/${array[0].category}/${array[0]._id}`);
      }
    });
  };
  const handleInvoice = (info) => {
    // var data = JSON.stringify({
    //   "ids": new Array(idx)
    // });
    console.log("DATA",info)
    let data = {
      bill_to_address:info.address,
      ship_to_address:info.address,
      pdf_layout:"0",
      ...info
    }
    generateInvoice(data);
  };
  const trackOrder = (awb_id) => {
    var data = new FormData();
    data.append("username", E_COM_USERNAME);
    data.append("password", E_COM_PASSWORD);
    data.append('awb', awb_id.toString());
    setAuthorizationToken(null, null, null, null);
    
    var config = {
      method: 'post',
      url: 'https://plapi.ecomexpress.in/track_me/api/mawbd/',
      data : data
    };
    
    axios(config)
    .then(function (response) {
      var XMLParser = require('react-xml-parser');
      var xml = new XMLParser().parseFromString(response.data);    // Assume xmlText contains the example XML
      console.log(xml);
      setXMLData(xml.children[0].children);
      setIsTrackingModal(true);
    })
    .catch(function (error) {
      console.log(error);
    });
  };
  const cancelOrder = (idx) => {
    var data = new FormData();
    data.append("username", E_COM_USERNAME);
    data.append("password", E_COM_PASSWORD);
    data.append("awbs", currentAWB.toString());
    setAuthorizationToken(null, null, null, null);
    var config = {
      method: "post",
      url: "https://api.ecomexpress.in/apiv2/cancel_awb/",
      data: data,
    };

    axios(config)
      .then(async function (response) {
        console.log(response.data);
        if (response.data[0].success) {
          setIsModal(false);
          setAuthorizationToken(
            `Bearer ${getCookie("token")}`,
            null,
            null,
            false
          );
          await axios.put(`${APIUrls.order}/${response.data[0].order_number}`, {
            deliveryStatus: "order cancelled",
          });
          await fetchDbOrder();
          alert.show("Order cancelled", {
            type: "success",
          });
        } else {
          alert.show(response.data[0].reason, {
            type: "error",
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const fetchDbOrder = (token) => {
    setAuthorizationToken(`Bearer ${getCookie("token")}`, null, null, false);
    axios
      .post(APIUrls.order, {
        email: user.role !== "admin" ? user.email : "",
      })
      .then(function (response) {
        console.log("FETCH ORDER", response.data);
        if (response.data.data) {
          var indexOfLastPost = 1 * postsPerPage;
          var indexOfFirstPage = indexOfLastPost - postsPerPage;
          setCurrentPage(1);
          setIndexOfFirstPage(indexOfFirstPage);
          setIndexOfLastPage(indexOfLastPost);
          setAllProductList(response.data.data);
          setProductList(
            response.data.data.slice(indexOfFirstPage, indexOfLastPost)
          );
          if (response.data.data.length > 0) {
            for (
              let i = 1;
              i <= Math.ceil(response.data.data.length / postsPerPage);
              i++
            ) {
              setPageNumber(...[i]);
            }
          } else {
            setPageNumber(1);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        alert.show(error.response.data.message, { type: "info" });
      });
  };
  const fetchToken = () => {
    var data = JSON.stringify({
      email: SHIPROCKET_USERNAME,
      password: SHIPROCKET_PASSWORD,
    });

    var config = {
      method: "post",
      url: "https://apiv2.shiprocket.in/v1/external/auth/login",
      headers: {
        "Content-Type": "application/json",
        Authorization: "",
      },
      data: data,
    };

    let token;
    axios(config)
      .then(async function (response) {
        console.log(response);
        const token = `Bearer ${response.data.token}`;
        setAPIToken(token);
        await fetchDbOrder(token);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // const Razorpay = useRazorpay();
  // const initiateRefund = (paymentId) => {
  //   // var instance = Razorpay()
  //   console.log(paymentId)
  //   axios.post(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
  //     "amount": "0"
  //   }).then((res) => {
  //     console.log("REFUND RESPONSE", res.data)
  //   }).catch(e => {
  //     console.log(e)
  //   })
  //   const rzpay = new Razorpay({ key_id: 'rzp_live_0I3nMo0UFceWVI', key_secret: 'REYg9ZcQKfoXnWQ7cyENhCZu' });
  //   rzpay.payments.refund(paymentId, {
  //     "amount": "100",
  //   })
  // }
  const initiateRefund = (paymentId, amount, order_id) => {
    setAuthorizationToken(null, null, null, null);
    axios
      .post(
        `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
        {
          headers: {
            Authorization: `Basic ${window.btoa(
              "rzp_test_4Xe4MdWnjEAV8C:g4pIBeH149q5UBHwVRFr6Sty"
            )}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            auth: {
              username: "rzp_test_4Xe4MdWnjEAV8C",
              password: "g4pIBeH149q5UBHwVRFr6Sty",
            },
          },
        },
        {
          amount: parseInt(amount),
        }
      )
      .then(async (res) => {
        console.log("REFUND API", res.data);
        if (res.data.status == "processed") {
          // updateShipRocketOrder(d);
          await axios.put(`${APIUrls.order}/${order_id}`, {
            paymentStatus: "Refunded",
          });
          await fetchDbOrder();
          alert.show("Refund in progress", {
            type: "success",
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
    // fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
    //   method: 'POST', mode: 'no-cors', credentials: "include", redirect: 'follow',
    //   agent: null,

    //   headers: {
    //     Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded',
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
    //     'Authorization': 'Basic ' + window.btoa('rzp_test_4Xe4MdWnjEAV8C:g4pIBeH149q5UBHwVRFr6Sty'),
    //   },
    //   body: JSON.stringify({
    //     amount: parseInt(amount*100)
    //   })
    // }
    // )
    //   .then(resp => resp.json())
    //   .then(data => {
    //     // Work with JSON data here
    //     // if (req_lang == "te-IN") {
    //     // ValuesforLang = data["Lang"];
    //     // console.log('data', data["Lang"]);
    //     console.log('data', data);
    //     // }
    //   })
    //   .catch(err => {
    //     // Do something for an error here
    //     console.log('err', err);
    //   })
  };
  const updateShipRocketOrder = (d) => {
    var data = { ...d, transaction_date_time: "Refunded" };
    var up_data = JSON.stringify(data);

    var config = {
      method: "post",
      url: "https://apiv2.shiprocket.in/v1/external/orders/update/adhoc",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${APIToken}`,
      },
      data: up_data,
    };

    axios(config)
      .then(function (response) {
        console.log("order updated");
        fetchDbOrder(APIToken);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div className="admin-wrapper d-flex justify-content-center flex-column">
      {user && user.role == "admin" && (
        <div className="button-wrapper justify-content-end d-flex mb-4 mt-4">
          <button className="ms-2" onClick={() => router.push("/admin/banner")}>
            View Banners
          </button>
          <button
            className="ms-2"
            onClick={() => router.push("/admin/banner/category")}
          >
            View Categories
          </button>
          <button className="ms-2" onClick={() => router.push("/admin")}>
            View Products
          </button>
        </div>
      )}
      <div className="product mt-4 d-flex justify-content-center table-wrapper flex-column">
        <table className="w-100">
          <thead>
            {/* <th></th> */}
            <th>Transaction ID</th>
            <th className="th-center">Order ID</th>
            <th className="th-center">AWB Number</th>
            <th className="th-center">Purchase Date</th>
            <th>Name</th>
            <th>Email</th>
            <th>Total Purchase</th>
            <th className="th-center">Payment/Refund Status</th>
            <th>Items</th>
            <th className="th-center">Invoice</th>
            <th className="th-center">Track</th>
            <th className="th-center">Order</th>
            {user && user.role == "admin" ? (
              <th className="th-center">Refund</th>
            ) : null}
          </thead>
          <tbody>
            {productList && productList.length > 0 ? (
              productList.map((d, index) => {
                return (
                  <tr>
                    <td>{d.transactionId ? d.transactionId : "-"}</td>
                    <td className="th-center">{d.orderId ? d.orderId : "-"}</td>
                    <td className="th-center">{d.awb_id ? d.awb_id : "-"}</td>
                    <td className="th-center">
                      {d.purchaseDate ? d.purchaseDate : "-"}
                    </td>
                    <td>{d.name}</td>
                    <td>{d.email}</td>
                    <td>
                      ₹
                      {d.items
                        ? +d.items.reduce(
                            (total, data) => total + data.qty * data.salePrice,
                            0
                          )
                        : "0"}
                    </td>
                    <td className="th-center text-uppercase">
                      <strong>{d.paymentStatus ? d.paymentStatus : "-"}</strong>
                    </td>
                    <td>
                      {d.items.length > 0
                        ? d.items.map((data) => {
                            return (
                              <div
                                className="item-wrapper"
                                style={{ minHeight: "50px" }}
                              >
                                <div className="img-wrapper">
                                  {/* {
                                      data && data.name.split('-')[2] ? <Image src={data.name.split('-')[2].replaceAll(',','/')} height={50} width={50}></Image> : (
                                        <span>No preview available</span>
                                      )
                                    } */}
                                </div>
                                <div className="text-wrapper">
                                  <p>
                                    <strong className="p-0">
                                      {data.title}
                                    </strong>
                                  </p>
                                  <p>{`Qty: ${
                                    data.qty ? data.qty : "-"
                                  }, Price: ₹${
                                    data.salePrice ? data.salePrice : "-"
                                  }, Variant: ${data.color}`}</p>
                                </div>
                              </div>
                            );
                          })
                        : null}
                    </td>
                    <td className="th-center">
                      <span
                        className="text-invoice"
                        onClick={() => handleInvoice(d)}
                      >
                        Invoice
                      </span>
                    </td>
                    <td className="th-center">
                      <span
                        className="text-track"
                        onClick={() => trackOrder(d.awb_id)}
                      >
                        Track
                      </span>
                    </td>
                    <td className="th-center">
                      {d.deliveryStatus == "order placed" ? (
                        <span
                          className="btn-cancel"
                          onClick={() => {
                            setIsModal(true);
                            setCurrenctAWB(d.awb_id);
                          }}
                        >
                          cancel
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    {user && user.role == "admin" ? (
                      <td className="th-center">
                        {d.paymentStatus == "Refunded" ? (
                          "-"
                        ) : (
                          <span
                            className="btn-cancel"
                            onClick={() => {
                              console.log(d);
                              initiateRefund(
                                d.transactionId,
                                d.items.reduce(
                                  (total, data) =>
                                    total + data.qty * data.salePrice,
                                  0
                                ),
                                d.orderId
                              );
                            }}
                          >
                            Initiate
                          </span>
                        )}
                      </td>
                    ) : null}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colspan="13" className="th-center">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {search ? (
          ""
        ) : (
          <div className="customer-table-pagination d-none d-md-block">
            <div className="table-pagination-row d-flex justify-content-center">
              <div className="table-pagination-number">
                {new Array(pageNumber)
                  .fill("")
                  .map((val, index) => {
                    return (
                      <Button
                        key={index}
                        className={
                          index + 1 === currentPage
                            ? "btn-number active"
                            : "btn-number"
                        }
                        variant="link"
                        onClick={() => {
                          if (index === initialPage) {
                            handleNavigation("prev");
                          } else if (index === lastPage - 1) {
                            handleNavigation("next");
                          } else {
                            setCurrentPage(index + 1);
                          }
                        }}
                        disabled={loadingData}
                      >
                        {index + 1}
                      </Button>
                    );
                  })
                  .slice(initialPage, lastPage)}
              </div>
            </div>
          </div>
        )}
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
          <div className="modal-form">
            <form onSubmit={(e) => handleAddCategory(e)}>
              <div className="input-wrapper">
                <label>
                  Category Name<span className="required-field">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                ></input>
              </div>
              <div className="input-wrapper">
                <label>
                  Banner Title<span className="required-field">*</span>
                </label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                />
              </div>
              <div className="input-wrapper">
                <label>
                  Banner Image (Mobile)<span className="required-field">*</span>
                </label>
                <input
                  type="file"
                  className="p-0"
                  accept="image/png, image/jpeg,image/jpg"
                  style={{ border: "none" }}
                  onChange={(e) => {
                    uploadImage(e, "mobile");
                  }}
                ></input>
              </div>
              {displayImage && (
                <div className="input-wrapper">
                  <Image src={displayImage} width={40} height={40}></Image>
                </div>
              )}
              <div className="input-wrapper">
                <label>
                  Banner Image (Desktop)
                  <span className="required-field">*</span>
                </label>
                <input
                  type="file"
                  className="p-0"
                  accept="image/png, image/jpeg,image/jpg"
                  style={{ border: "none" }}
                  onChange={(e) => {
                    uploadImage(e, "desktop");
                  }}
                ></input>
              </div>
              {displayImageDesktop && (
                <div className="input-wrapper">
                  <Image
                    src={displayImageDesktop}
                    width={40}
                    height={40}
                  ></Image>
                </div>
              )}
              <div className="input-wrapper">
                <label>Active</label>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                ></input>
              </div>
              <div className="input-wrapper">
                <label></label>
                <input type="submit" value="Add Category"></input>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={isModal} onHide={() => setIsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Remove</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to cancel this order?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => cancelOrder()}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={isTrackingModal} onHide={() => setIsTrackingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tracking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-form">
            {
              xmlData && xmlData.length>0 ? 
                <ul>
                  {
                    xmlData.filter(d=>d.attributes.name=='tracking_status').map(d => {
                      return <li>{d.value}</li>
                    })
                  }
                </ul>
              :('No shipping records!')
            }
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
