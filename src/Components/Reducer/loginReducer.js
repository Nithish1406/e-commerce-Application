export const initialState = {
    username: '',
    email: '',
    npassword: '',
    cpassword: '',
    utype: '',
    errors: {
        username: '',
        email: '',
        npassword: '',
        cpassword: '',
        utype: '',
    },
    login:
    {
        email: '',
        utype: '',
        password: '',
        errors: {
            email: '',
            password: ''
        }
    },
    loginvalid: ''
}

export const loginReducer=(state, action)=>{
    switch (action.type) {
        case 'DATA':
            return {
                ...state, [action.payload.field]: action.payload.value
            };
        case 'LOGIN_DATA':
            return {
                ...state, login: { ...state.login, [action.payload.field]: action.payload.value }
            };
        case 'ERROR':
            return {
                ...state, errors: { ...state.errors, [action.payload.field]: action.payload.error }
            };
        case 'LOGIN_ERROR':
            return {
                ...state, login: { ...state.login, errors: { ...state.login.errors, [action.payload.field]: action.payload.error } }
            };
        case 'CLEAR_ERROR':
            return { ...state, errors: { username: '', email: '', npassword: '', cpassword: '', utype: '' } };
        case 'LOGIN_CLEAR_ERROR':
            return { ...state, login: { ...state.login, errors: { email: '', utype: '', password: '' } } };
        case 'CLEAR_VALUE':
            return { ...state, username: '', email: '', npassword: '', cpassword: '', utype: '' };
        case 'LOGIN_CLEAR_VALUE':
            return { ...state, login: { ...state.login, email: '', utype: '', password: '' } };
        case 'LOGIN_TOGGLE_CLEAR_VALUE':
            return { ...state, login: { ...state.login, email: '', password: '' } };
        case 'LOGIN_VALID':
            return { ...state, [action.payload.field]: action.payload.error };
        case 'LOGIN_VALID_CLEAR':
            return { ...state, loginvalid: '' };
        default:
            return state;
    }
}