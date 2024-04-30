import axios from 'axios';

var TestAxios = axios.create({
  baseURL: 'http://localhost:8080/api',
  /* other custom settings */
});

/*
Deo koda koji presrece svaki zahtev koji ide ka backend-u, proverava da li postoji jwd
u local storage-u, i ubacuje ga u header zahteva
*/
TestAxios.interceptors.request.use(
  function add_jwt(config){
    if(window.localStorage["jwt"]){
      config.headers["Authorization"]="Bearer " + window.localStorage["jwt"]
    }
    return config
  }
)

export default TestAxios;
