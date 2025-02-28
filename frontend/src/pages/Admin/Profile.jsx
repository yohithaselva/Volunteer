import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUserById, updateUser } from '../../api'; // Import API functions

function User() {
  const [profile, setProfile] = useState({
    name: '',
    year: '',
    department: '',
    email: '',
    phone: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch user ID from local storage
  const userId = localStorage.getItem('userId'); // Ensure you store the user ID in local storage after login

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        toast.error('User ID not found in local storage');
        return;
      }

      try {
        const data = await getUserById(userId);
        setProfile(data);
      } catch (error) {
        toast.error('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error('User ID not found in local storage');
      return;
    }

    try {
      await updateUser(userId, profile);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 p-6 md:p-12 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-extrabold text-white mb-3">Edit Profile</h1>
            <p className="text-indigo-200">Update your personal details and preferences.</p>
          </div>
        </header>

        {/* Profile Editing Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-semibold text-white">Personal Information</h3>
            <button
              className="bg-indigo-600 text-white font-semibold text-lg px-6 py-3 rounded-lg hover:bg-indigo-500 transition"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {/* Profile Fields */}
          {Object.entries(profile).map(([key, value]) => (
            <div key={key} className="mb-6">
              <label className="block mb-2 text-xl font-semibold text-indigo-200 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type={key === 'email' ? 'email' : 'text'}
                name={key}
                value={value}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-4 bg-transparent border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>
          ))}

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end space-x-6 mt-8">
              <button
                className="bg-green-500 text-white text-lg px-8 py-3 rounded-lg hover:bg-green-600 transition"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ToastContainer for notifications */}
      <ToastContainer />
    </div>
  );
}

export default User;