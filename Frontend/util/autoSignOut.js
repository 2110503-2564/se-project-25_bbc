  import { isTokenValid } from "./jwtExpireCheck";
  
  // Helper function to check token validity from localStorage
  const checkTokenValidity = async () => {
    const storedToken = localStorage.getItem("token");
    console.log("Stored token:", isTokenValid(storedToken), storedToken);
    if (storedToken && isTokenValid(storedToken)) {
      return ;
    } else {

        localStorage.removeItem("token");
        localStorage.clear();
        document.cookie = "token=; path=/; max-age=0";
      
    }
  };

  export default checkTokenValidity;