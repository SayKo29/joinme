export type AuthData = {
    token: string;
    email: string;
    name: string;
};
const encodeFormData = (data) => {
    return Object.keys(data)
        .map(
            (key) =>
                encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
        )
        .join("&");
};
const signIn = async (formData) => {
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
    //       token: JWTTokenMock,
    //       email: email,
    //       name: 'Lucas Garcez',
    //     });
    //   }, 1000);
    // });
};

export const authService = {
    signIn,
};

const JWTTokenMock =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikx1Y2FzIEdhcmNleiIsImlhdCI6MTUxNjIzOTAyMn0.oK5FZPULfF-nfZmiumDGiufxf10Fe2KiGe9G5Njoa64";
