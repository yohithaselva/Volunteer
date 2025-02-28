import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createVolunteerProfile,
  updateVolunteerProfile,
  getVolunteerProfile,
} from "../../api"; // Import the API functions

function VolunteerProfile() {
  const [volunteerProfile, setVolunteerProfile] = useState({
    skills: "",
    interests: "",
    availability: "none", // Default availability
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const userId = localStorage.getItem("userId"); // Get user ID from localStorage

  const availabilityOptions = [
    { value: "none", label: "Select Availability" },
    { value: "fullTime", label: "Full-time" },
    { value: "partTime", label: "Part-time" },
    { value: "weekends", label: "Weekends" },
    { value: "evenings", label: "Evenings" },
  ];

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }

        // Fetch volunteer profile for the current user
        const response = await getVolunteerProfile(userId);

        console.log("API response:", response); // Log the API response

        if (response && response.data) {
          // Profile exists
          setProfileExists(true);
          setVolunteerProfile({
            skills: response.data.skills || "",
            interests: response.data.interests || "",
            availability: response.data.availability || "none",
          });
        } else {
          // No profile exists, use the default empty state
          setProfileExists(false);
          setIsEditing(true); // Enable editing for new profile creation
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
        setProfileExists(false);
        setIsEditing(true); // Enable editing if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setVolunteerProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle save or update profile
  const handleSave = async () => {
    try {
      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }

      const payload = {
        ...volunteerProfile,
        user_id: userId,
      };

      console.log("Sending payload:", payload); // Log the payload

      let response;
      if (profileExists) {
        // Update existing profile
        response = await updateVolunteerProfile(userId, payload);
        console.log("Update response:", response); // Log the response
        toast.success("Volunteer profile updated successfully!");
      } else {
        // Create new profile
        response = await createVolunteerProfile(payload);
        setProfileExists(true); // Mark profile as existing after creation
        toast.success("Volunteer profile created successfully!");
      }

      setIsEditing(false); // Disable editing after saving
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(
        profileExists ? "Failed to update profile" : "Failed to create profile"
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 p-6 flex items-center justify-center">
        <div className="text-white text-2xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 p-6 md:p-12 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-extrabold text-white mb-3">
              Volunteer Profile
            </h1>
            <p className="text-indigo-200">
              {profileExists
                ? "Update your volunteer skills, interests, and availability."
                : "Create your volunteer profile with skills, interests, and availability."}
            </p>
          </div>
        </header>

        {/* Profile Editing Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-semibold text-white">
              {profileExists ? "Volunteer Information" : "Create Profile"}
            </h3>
            {profileExists && (
              <button
                className="bg-indigo-600 text-white font-semibold text-lg px-6 py-3 rounded-lg hover:bg-indigo-500 transition"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            )}
          </div>

          {/* Skills */}
          <div className="mb-6">
            <label className="block mb-2 text-xl font-semibold text-indigo-200">
              Skills
            </label>
            <input
              name="skills"
              value={volunteerProfile.skills}
              onChange={handleProfileChange}
              disabled={!isEditing}
              className="w-full p-4 bg-transparent border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="List your relevant skills (e.g., JavaScript, React, Python)"
            />
          </div>

          {/* Interests */}
          <div className="mb-6">
            <label className="block mb-2 text-xl font-semibold text-indigo-200">
              Interests
            </label>
            <input
              name="interests"
              value={volunteerProfile.interests}
              onChange={handleProfileChange}
              disabled={!isEditing}
              className="w-full p-4 bg-transparent border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Share your volunteering interests (e.g., Education, Community Outreach)"
            />
          </div>

          {/* Availability - as dropdown */}
          <div className="mb-6">
            <label className="block mb-2 text-xl font-semibold text-indigo-200">
              Availability
            </label>
            <select
              name="availability"
              value={volunteerProfile.availability}
              onChange={handleProfileChange}
              disabled={!isEditing}
              className="w-full p-4 bg-transparent border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 transition text-white"
            >
              {availabilityOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-indigo-900 text-white"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-6 mt-8">
            {isEditing && (
              <button
                className="bg-green-500 text-white text-lg px-8 py-3 rounded-lg hover:bg-green-600 transition"
                onClick={handleSave}
              >
                {profileExists ? "Save Changes" : "Create Profile"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default VolunteerProfile;