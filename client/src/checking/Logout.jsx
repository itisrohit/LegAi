import axios from 'axios'

function Logout() {
    const handleLogout = async () => {
        try {
          await axios.post("http://localhost:8080/api/v1/logout", {}, { withCredentials: true });
          alert("Logged out successfully!");
          window.location.href = "/"; 
        } catch (error) {
          console.error("Logout failed:", error);
          alert("Failed to log out");
        }
      };
      
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Logout
