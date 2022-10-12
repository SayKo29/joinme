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
        // "https://landscapediscoverapi.herokuapp.com/api/auth/login",
        "http://192.168.1.199:3000/api/auth/login",
        requestOptions
    );
    const json = await response.json();
    if (json?.status == 0) {
        return false;
    } else {
        return json.data;
    }
    // return new Promise((resolve) => {

    //   setTimeout(() => {
    //     resolve({
    //       email: email,
    //       name: 'Lucas Garcez',
    //     });
    //   }, 1000);
    // });
};

export const authService = {
    signIn,
};
