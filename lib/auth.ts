export const isAdminAuthenticated = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token"); 
      if (!token) {
        return false; 
      }
  
      // Optionally, you can check if the token is expired (if your JWT includes an 'exp' claim)
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token
        const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
  
        if (decodedToken.exp < currentTime) {
          // If token is expired, return false
          localStorage.removeItem("token"); // Optional: Remove expired token from localStorage
          return false;
        }
      } catch (error) {
        console.error("Invalid token", error);
        return false;
      }
  
      return true; // If token exists and is valid, return true
    }
  
    return false; // In case window is undefined (server-side), return false
  };
  