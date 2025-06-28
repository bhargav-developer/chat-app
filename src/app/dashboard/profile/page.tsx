"use client"
import { useUserStore } from "@/lib/userStore";
import axios from "axios";
import React, { useEffect, useState } from "react";

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const { setUser } = useUserStore()
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    bio: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    getProfileDetails();
  }, []);

  const getProfileDetails = async () => {
    try {
      const res = await axios.get("/api/profile/getUserProfile", { withCredentials: true });
      setUserData(res.data);
      setFormData({
        firstName: res.data.firstName || "",
        lastName: res.data.lastName || "",
        phone: res.data.phone || "",
        location: res.data.location || "",
        bio: res.data.bio || "",
        email: res.data.email || "",
        avatar: res.data.avatar || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const UpdateProfile = async () => {
    const res = await axios.post("/api/profile/updateProfile", { formData }, { withCredentials: true });
    if (res.data) {
      const data = res.data 
      setUserData(res.data)
      const userData = {
        id: data._id,
        name: data.firstName +" "+ data.lastName,
        email: data.email,
        avatar: data.avatar,
      }
      setUser(userData)

    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">User Profile</h1>
          {isEditing ? (
            <div className="space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  UpdateProfile()
                  setIsEditing(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-200"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-200"
            >
              Edit Profile
            </button>
          )}
        </div>


        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center mb-8">
          <div className="relative">
            <img
              src={formData.avatar || "https://avatars.githubusercontent.com/u/000?v=4"}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
          </div>
          <h2 className="text-xl font-bold mt-4">{formData.firstName} {formData.lastName}</h2>
          <p className="text-gray-600">{formData.email}</p>
        </div>

        {/* Personal Info */}
        <div className="bg-white shadow-sm rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">First Name</label>
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full mt-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${isEditing ? "bg-white ring-indigo-500" : "bg-gray-50 border-gray-300"}`}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Last Name</label>
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full mt-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${isEditing ? "bg-white ring-indigo-500" : "bg-gray-50 border-gray-300"}`}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <input
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full mt-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${isEditing ? "bg-white ring-indigo-500" : "bg-gray-50 border-gray-300"}`}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Location</label>
              <input
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full mt-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${isEditing ? "bg-white ring-indigo-500" : "bg-gray-50 border-gray-300"}`}
              />
            </div>
          </div>
        </div>

        {/* Status & Bio */}
        <div className="bg-white shadow-sm rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Status & Bio</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Status Message</label>
              <input
                name="status"
                type="text"
                value="Available for chat 💬"
                readOnly
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full mt-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${isEditing ? "bg-white ring-indigo-500" : "bg-gray-50 border-gray-300"}`}
                rows={3}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white shadow-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Privacy Settings</h3>
          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-600">Show Online Status</label>
            <input type="checkbox" checked readOnly className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
