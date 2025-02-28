import { Link, useNavigate } from "react-router-dom";
import { BarChart2, LogOut } from 'lucide-react'; // Import icons
import { logoutUser } from "../api";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Check if the user is logged in

  const handleLogout = async () => {
    try {
      console.log('Attempting to log out...');
      const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage
      await logoutUser(userId);
      console.log('Logout successful. Removing token and role...');
      localStorage.removeItem('token'); // Remove token
      localStorage.removeItem('userRole'); // Remove user role
      localStorage.removeItem('userId'); // Remove userId
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getDashboardRoute = () => {
    const userRole = localStorage.getItem("userRole");
    return userRole === "Admin" ? "/admindashboard" : "/dashboard";
  };

  return (
    <nav className="sticky top-0 max-h-max left-0 w-full bg-gradient-to-br from-indigo-900 to-purple-800 shadow-lg z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo with hover animation */}
        <Link 
          to={getDashboardRoute()} 
          className="text-white text-2xl font-bold flex items-center space-x-2 transform transition duration-300 hover:scale-105"
        >
          <span className="bg-white/20 p-2 rounded-full">
            <BarChart2 className="text-white" />
          </span>
          <span>Event Hub</span>
        </Link>

        {/* Desktop Navigation */}
        {token && ( // Only show logout link if the user is logged in
          <div className="flex items-center space-x-6">
            <div
              onClick={handleLogout}
              className="group flex items-center space-x-2 text-white hover:text-indigo-200 transition duration-300 transform hover:scale-105 cursor-pointer"
            >
              <LogOut className="text-white/70 group-hover:text-white transition duration-300" size={20} />
              <span className="font-medium">Logout</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;