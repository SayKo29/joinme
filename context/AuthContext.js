import createDataContext from './createDataContext';

const authReducer = (state, action) => {
    switch (action.type) {
        case 'signout':
            return { token: null, email: '' };
        case 'signin':
        case 'signup':
            return {
                token: action.payload.token,
                email: action.payload.email,
            };
        default:
            return state;
    }
};

const signup = dispatch => {
    return ({ email, password }) => {
        console.log('Signup');
    };
};

const encodeFormData = (data) => {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
}

const logInRequest = async (formData) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormData(formData)
    };
    const response = await fetch('http://192.168.1.199:3000/api/auth/login', requestOptions);
    const json = await response.json();
    if (json?.status == 0) {
        return false
    } else {
        return json.data
    }
    // console.log(json?.status)
}

const signin = dispatch => {
    return ({ email, password }) => {
        // Do some API Request here
        logInRequest({ email: email, password: password }).then(data => {
            if (data) {
                dispatch({
                    type: 'signin',
                    payload: {
                        token: data.token,
                        userData: {
                            id: data._id,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                        },
                        email: data.email,
                    },

                })
            } else {
                firstName = false
            }
        });
        // if (login) {
        //     dispatch({
        //         type: 'signin',
        //         payload: {
        //             token: login.token,
        //             email: login.email,
        //         },

        //     })
        // }
        // .then(response => response.json())
        // .then(data => dispatch({
        //     type: 'signin',
        //     payload: {
        //         token: data,
        //         email: data,
        //     },

        // })).catch(console.error);

        console.log('Signin');
    };
};

const signout = dispatch => {
    return () => {
        dispatch({ type: 'signout' });
    };
};

export const { Provider, Context } = createDataContext(
    authReducer,
    { signin, signout, signup },
    { token: null, email: '', firstName: '' },
);