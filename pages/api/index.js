const API_ROOT = "https://vedayuu.herokuapp.com"; //THIS IS LOCAL LINK
// const API_ROOT = "http://localhost:8000"; //THIS IS LOCAL LINK
//https://vedayuu.herokuapp.com
const APIUrls = {
  login: API_ROOT + "/user/login",
  register: API_ROOT + "/user/create",
  product: API_ROOT + "/product",
  save_cart: API_ROOT + "/user/add-to-cart",
  upload_img: API_ROOT + "/product/upload",
  search_product: API_ROOT + "/product/search",
  create_product: API_ROOT + "/product/create",
  banner: API_ROOT + "/banner",
  banner_create: API_ROOT + "/banner/create",
  add_shipping_address: API_ROOT + "/user/add-address",
  add_category: API_ROOT + "/category-list/create",
  categoryList: API_ROOT + "/category-list",
  order: API_ROOT + "/order",
  validate_order: API_ROOT + "/order/validate",
  create_order: API_ROOT + "/order/create",
  fetch_coupon: API_ROOT + "/coupon",
  init_razorpay: API_ROOT + "/order/razorpay",
  reset_password: API_ROOT + "/user/reset",
  forgot: API_ROOT + "/user/forgot",
};
export default APIUrls;
