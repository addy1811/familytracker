import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AVATAR from "../assets/avatar.jpg";

export default function ProfileEdit({refreshUser}) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dob, setDob] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(AVATAR);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/me`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        if (data?.dob) {
          const formattedDob = data.dob.split("T")[0];
          setDob(formattedDob);
        } else {
          setDob("");
        }
        setPreview(data?.photo_url || AVATAR);
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };
  
  

  const handleSave = async () => {
    const formData = new FormData();
    if (dob) formData.append("dob", dob);
    if (photo) formData.append("photo", photo);
  
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/me/profile`, {
      method: "POST",
      credentials: "include",
      body: formData
    });
  
    if (res.ok) {
      await refreshUser(); 
      navigate("/memory");
    } else {
      const err = await res.json();
      console.error(err);
    }
  };

  if (!user) {
    return <div className="text-white">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#161a26]">
      <div className="bg-black/60 p-6 rounded-xl w-96">
        <h2 className="text-white text-xl mb-4">My Profile</h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-4">
          <label className="cursor-pointer">
            <img
              src={preview}
              className="w-24 h-24 rounded-full object-cover border-2 border-yellow-400 mb-2"
            />
            <input type="file" hidden onChange={handleImageChange} />
          </label>
          <span className="text-sm text-gray-400">Click image to update</span>
        </div>

        {/* NAME */}
        <div className="mb-3">
          <label className="text-gray-400 text-sm">Name</label>
          <input
            value={user.name}
            disabled
            className="w-full p-2 rounded bg-[#232733] text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* DOB */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full p-2 rounded bg-[#232733] text-white"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-yellow-400 py-2 rounded font-semibold hover:bg-yellow-500"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}