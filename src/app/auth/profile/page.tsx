'use client';
import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

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
  const [avatarList, setAvatarList] = useState<string[]>(presetAvatars.maleAvatar);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(presetAvatars.maleAvatar[0]);
  const [name, setName] = useState<string>('');
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
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
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      if (res.status === 200) {
        const userDetails = res.data.user;
        setFormData(prev => ({
          ...prev,
          email: userDetails.email || '',
          bio: userDetails.bio || '',
          phone: userDetails.phone || '',
          location: userDetails.location || '',
        }));
        setName(`${userDetails.firstName} ${userDetails.lastName}`);
        setSelectedAvatar(userDetails.avatar || presetAvatars.maleAvatar[0]);
        setGender(userDetails.gender || 'male');
    console.log(userDetails)

      }
    } catch (err) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedAvatar(imageUrl); // For preview only – this won’t persist across sessions
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (formData.phone && isNaN(parseInt(formData.phone))) {
        toast.error("Phone number must be a valid number.");
        return;
      }

      const res = await axios.post(
        '/api/auth/profile',
        {
            ...formData,
            avatar: selectedAvatar,
            gender,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Profile is updated");
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="text-center flex justify-center items-center h-[100vh]">
        Loading...
      </div>
    );
  }

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
                className={`w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition-all duration-300 transform hover:scale-105 ${selectedAvatar === avatar
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
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">
            {name && `Hi ${name},`} <br /> Let’s Get to Know You More
          </h2>

          <InputField label="Email" name="email" editable={false} value={formData.email} onChange={handleChange} type="email" />

          {/* Gender Toggle Buttons */}
          <div className="flex gap-4 mb-2">
            {['male', 'female'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g as 'male' | 'female')}
                className={`px-4 py-2 rounded-lg border ${gender === g
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white/60 border-gray-300 text-gray-700 hover:bg-indigo-100'
                  } transition`}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>

          <InputField label="Phone (optional)" name="phone" value={formData.phone} onChange={handleChange} />
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

const InputField = ({
  label,
  name,
  value,
  editable = true,
  onChange,
  type = 'text',
}: {
  label: string;
  name: string;
  value: string;
  editable?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      disabled={!editable}
      onChange={onChange}
      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white/60 backdrop-blur placeholder-gray-500 text-gray-800"
    />
  </div>
);
