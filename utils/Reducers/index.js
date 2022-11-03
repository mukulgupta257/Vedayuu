// import _ from 'lodash';
import {
    SET_SIGNATURE,
    SET_USER_INFO,
    SET_IS_LOADING,
    SET_CURRENCY,
    SET_CATEGORY_LIST,
    SET_SHIPROCKET_TOKEN,
    SET_CART_FLAG
} from '../Actions/types';

const initialState = {
    user: {},
    signature: '',
    isLoading: false,
    isLoader: false,
    currency: "",
    categoryList: [],
    shipRocketToken: '',
    cart_flag: false

}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case SET_SIGNATURE: return {
            ...state,
            signature: action.user.data
        }
            break;
        case SET_USER_INFO:
            console.log("coming", action.data);
            return {
                ...state,
                user: action.data
            }
            break;
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.data
            }
            break;
        case SET_CURRENCY: return {
            ...state,
            currency: action.user.currency
        }
            break;
        case SET_CATEGORY_LIST: return {
            ...state,
            categoryList: action.user.categoryList
        }
            break;
        case SET_SHIPROCKET_TOKEN:
            return {
                ...state,
                shipRocketToken: action.data
            }
            break;
        case SET_CART_FLAG:
            return {
                ...state,
                cart_flag: action.data
            }
            break;
        default: return state;
    }
}

export default reducer;