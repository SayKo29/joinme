export type AuthData = {
    token: string;
    email: string;
    name: string;
};
const encodeFormData = (data: any) => {
    return Object.keys(data)
        .map(
            (key) =>
                encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
        )
        .join("&");
};
const signIn = async (formData: any) => {
    // this is a mock of an API call, in a real app
    // will be need connect with some real API,
    // send email and password, and if credential is corret
    //the API will resolve with some token and another datas as the below
    console.log(formData);
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData(formData),
    };
    const response = await fetch(
        "https://joinmeapi.onrender.com/api/login",
        // "http://192.168.1.199:5000/api/login",
        requestOptions
    );
    const json = await response.json();
    console.log(json);
    if (json?.status == 0) {
        return false;
    } else {
        return json;
    }
};
const register = async (formData: any) => {
    // this is a mock of an API call, in a real app
    // will be need connect with some real API,
    // send email and password, and if credential is corret
    //the API will resolve with some token and another datas as the below
    console.log(formData);
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData(formData),
    };
    const response = await fetch(
        // "https://joinmeapi.onrender.com/api/register",
        "http://192.168.1.199:5000/api/register",
        requestOptions
    );
    const json = await response.json();
    console.log(json);
    if (json?.status == 400 || json?.status == 0) {
        return false;
    } else {
        return json;
    }
};

export const authService = {
    signIn,
    register,
};
