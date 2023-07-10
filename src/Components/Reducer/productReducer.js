export const initialState = {
    product_no: '',
    product_name: '',
    category: '',
    price: '',
    purchased: '',
    purchased_date: '',
    product_image: '',
    errors: {
      product_no: '',
      product_name: '',
      category: '',
      price: '',
      purchased: '',
      purchased_date: '',
      product_image: '',
    }
  }
export const productReducer=(state, action)=>{
    switch (action.type) {
      case "ADD_DATA":
        return { ...state, [action.payload.field]: action.payload.value };
      case "ERROR_DATA":
        return { ...state, errors: { ...state.errors, [action.payload.field]: action.payload.error } };
      case "CLEAR_ERROR_DATA":
        return { ...state, errors: { product_no: '', product_name: '', category: '', price: '', purchased: '', purchased_date: '' } };
      case "CLEAR_DATA":
        return { ...state, product_no: '', product_name: '', category: '', price: '', purchased: '', purchased_date: '' };
      default:
        return state;
    }
  }