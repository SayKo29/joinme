// import createDataContext from "./createDataContext";
// import * as SecureStore from "expo-secure-store";
// import * as LocalAuthentication from "expo-local-authentication";

// const authReducer = (state, action) => {
//     switch (action.type) {
//         case "signout":
//             return { token: null, email: "", userData: {} };
//         case "signin":
//         case "signup":
//             return {
//                 token: action.payload.token,
//                 email: action.payload.email,
//                 userData: action.payload.userData,
//             };
//         default:
//             return state;
//     }
// };

// const signup = (dispatch) => {
//     return ({ email, password }) => {
//         console.log("Signup");
//     };
// };

// const encodeFormData = (data) => {
//     return Object.keys(data)
//         .map(
//             (key) =>
//                 encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
//         )
//         .join("&");
// };

// const logInRequest = async (formData) => {
//     const requestOptions = {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: encodeFormData(formData),
//     };
//     const response = await fetch(
//         "http://192.168.1.199:3000/api/auth/login",
//         requestOptions
//     );
//     const json = await response.json();
//     if (json?.status == 0) {
//         return false;
//     } else {
//         return json.data;
//     }
//     // console.log(json?.status)
// };

// async function save(key, value) {
//     await SecureStore.setItemAsync(key, value);
//     console.log(key, value, "-----SEEETT");
// }

// async function getValueFor(key) {
//     let result = await SecureStore.getItemAsync(key);
//     if (result) {
//         console.log("🔐 Here's your value 🔐 \n" + result);
//     } else {
//         console.log("No values stored under that key.");
//     }
// }

// const signin = (dispatch) => {
//     return ({ email, password }) => {
//         // Do some API Request here
//         logInRequest({ email: email, password: password }).then((data) => {
//             if (data) {
//                 dispatch({
//                     type: "signin",
//                     payload: {
//                         token: data.token,
//                         userData: {
//                             id: data._id,
//                             firstName: data.firstName,
//                             lastName: data.lastName,
//                             email: data.email,
//                         },
//                         email: data.email,
//                     },
//                 });
//                 save("token", data.token);
//                 save("userData", {
//                     id: data._id,
//                     firstName: data.firstName,
//                     lastName: data.lastName,
//                     email: data.email,
//                 });
//                 save("email", data.email);
//             } else {
//                 firstName = false;
//             }
//         });

//         console.log("Signin");
//     };
// };

// const signout = (dispatch) => {
//     return () => {
//         dispatch({ type: "signout" });
//     };
// };

// export const { Provider, Context } = createDataContext(authReducer, {
//     signin,
//     signout,
//     signup,
//     save,
//     getValueFor,
// });
