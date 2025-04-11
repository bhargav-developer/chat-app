'use client';
import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react'; 
import axios from 'axios';

const presetAvatars = {
  maleAvatar: [
    'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairDreads01&clotheType=Hoodie&facialHairType=Blank&eyeType=Happy&eyebrowType=UpDownNatural&mouthType=Default&skinColor=Light',
    'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Wayfarers&hairColor=Blonde&facialHairType=Blank&clotheType=Hoodie&clotheColor=Red&eyeType=Happy&eyebrowType=Default&mouthType=Smile&skinColor=Light',
    'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=Kurt&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=Hoodie&eyeType=Happy&eyebrowType=UpDown&mouthType=Smile&skinColor=Brown',
    'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=Blue03&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Smile&skinColor=DarkBrown'
  ],
  femaleAvatar: [
    'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Round&hairColor=Black&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light',
    'https://avataaars.io/?avatarStyle=Circle&topType=LongHairCurly&accessoriesType=Blank&hairColor=Brown&clotheType=ShirtCrewNeck&eyeType=Happy&eyebrowType=UpDown&mouthType=Twinkle&skinColor=Light',
    'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight2&accessoriesType=Round&hairColor=Blonde&hatColor=Red&clotheType=GraphicShirt&eyeType=Wink&eyebrowType=RaisedExcited&mouthType=Twinkle&skinColor=Light',
    'https://avataaars.io/?avatarStyle=Circle&topType=LongHairBob&accessoriesType=Blank&hairColor=Red&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Wink&eyebrowType=Default&mouthType=Smile&skinColor=DarkBrown'
  ],
};

const ProfilePage = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [avatarList, setAvatarList] = useState<string[]>(presetAvatars.femaleAvatar);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(presetAvatars.femaleAvatar[0]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    location: '',
  });

  useEffect(() => {
    const avatars = gender === 'male' ? presetAvatars.maleAvatar : presetAvatars.femaleAvatar;
    setAvatarList(avatars);
    setSelectedAvatar(avatars[0]);
  }, [gender]);

  useEffect(() => {
    fetchUserDetails()
  }, []);
  
  const fetchUserDetails = async () =>{
    const res = await axios.get("/api/auth/me")
    if(res.status === 200){
      setFormData({ ...formData,
        email: res.data.user.email
      })
    }

  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedAvatar(imageUrl);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log('Saved Profile:', { ...formData, avatar: selectedAvatar, gender });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-indigo-100 to-indigo-200 p-6">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
        {/* Left - Avatar */}
        <div className="md:w-1/3 bg-white/10 p-6 flex flex-col items-center border-r border-white/20">
          <img
            src={selectedAvatar}
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover shadow-md mb-4 border-4 border-white/40"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {avatarList.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                className={`w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition-all duration-300 ${
                  selectedAvatar === avatar
                    ? 'border-indigo-500 ring-2 ring-indigo-300'
                    : 'border-transparent hover:border-gray-300'
                }`}
                onClick={() => setSelectedAvatar(avatar)}
                alt={`Avatar ${index}`}
              />
            ))}
          </div>

          <label className="mt-2 group cursor-pointer bg-white/30 hover:bg-white/50 text-indigo-700 px-4 py-2 text-sm rounded-lg border border-indigo-300 shadow-sm transition">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Upload Custom</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Right - Form */}
        <div className="md:w-2/3 p-8 space-y-4">
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">Edit Profile</h2>


          <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
          <InputField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
          <div className="flex gap-4 mb-2">
            <label className="flex items-center text-black gap-2">
            <label className="flex items-center text-black gap-2">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={() => setGender('male')}
                className="accent-indigo-600"
              />
              Male
            </label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={() => setGender('female')}
                className="accent-indigo-600"
              />
              Female
            </label>
            
          </div>
          <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          <InputField label="Location" name="location" value={formData.location} onChange={handleChange} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us something about you..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white/60 backdrop-blur placeholder-gray-500 text-gray-800"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl shadow-md transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// Reusable InputField component
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white/60 backdrop-blur placeholder-gray-500 text-gray-800"
    />
  </div>
);
