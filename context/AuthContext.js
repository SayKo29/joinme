import createDataContext from "./createDataContext";

const authReducer = (state, action) => {
    switch (action.type) {
        case "signout":
            return { token: null, email: "", userData: {} };
        case "signin":
        case "signup":
            return {
                token: action.payload.token,
                email: action.payload.email,
                userData: action.payload.userData,
            };
        default:
            return state;
    }
};

const signup = (dispatch) => {
    return ({ email, password }) => {
        console.log("Signup");
    };
};

const encodeFormData = (data) => {
    return Object.keys(data)
        .map(
            (key) =>
                encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
        )
        .join("&");
};

const logInRequest = async (formData) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData(formData),
    };
    const response = await fetch(
        "http://192.168.1.199:3000/api/auth/login",
        requestOptions
    );
    const json = await response.json();
    if (json?.status == 0) {
        return false;
    } else {
        return json.data;
    }
    // console.log(json?.status)
};

const signin = (dispatch) => {
    return ({ email, password }) => {
        // Do some API Request here
        logInRequest({ email: email, password: password }).then((data) => {
            if (data) {
                dispatch({
                    type: "signin",
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
                });
            } else {
                firstName = false;
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

        console.log("Signin");
    };
};

const signout = (dispatch) => {
    return () => {
        dispatch({ type: "signout" });
    };
};

export const { Provider, Context } = createDataContext(
    authReducer,
    { signin, signout, signup },
    {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjM4YzliMmU1MzA5ZjY1MzRjOGVmMDkiLCJmaXJzdE5hbWUiOiJBYXJvbiIsImxhc3ROYW1lIjoiU2FybWllbnRvIiwiZW1haWwiOiJmaWVybzQ4MjZAZ21haWwuY29tIiwiaWF0IjoxNjU4NjE2MTMzLCJleHAiOjE2NTg2MjMzMzN9.5TAjeUsxn70pFAk1qb9SRRtlOsQe-Dq5MDfa1Es_dM8",
        email: "fiero4826@gmail.com",
        userData: {},
    }
);
