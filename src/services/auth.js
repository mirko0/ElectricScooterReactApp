import TestAxios from "../apis/TestAxios.js"

export const login = async (username, password) => {

    const body = {
        username: username,
        password: password
    }
    try{
        const resp = await TestAxios.post("/korisnici/auth", body)
        window.localStorage.setItem("jwt", resp.data)
        window.location.replace("http://localhost:3000")
    }catch(e){
        console.log(e)
        alert("Login FAILED")
    }
}

export const logout = () => {
    window.localStorage.removeItem("jwt")
    window.location.replace("http://localhost:3000")
}