import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import assets from "../assets/assets";

const ProfilePage = () => {

  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  // load user data initially
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  // update UI fields when authUser updates
  useEffect(() => {
    setName(authUser.fullName);
    setBio(authUser.bio);
  }, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // case 1 → no new image selected
    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    // case 2 → new image selected
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);

    reader.onload = async () => {
      const base64Image = reader.result;

      await updateProfile({
        profilePic: base64Image,
        fullName: name,
        bio
      });

      navigate("/");
    };
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">

      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">

        {/* LEFT SIDE FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">

          <h3 className="text-lg font-semibold">Profile Details</h3>

          {/* PROFILE IMAGE UPLOAD */}
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">

            <input
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
              onChange={(e) => setSelectedImg(e.target.files[0])}
            />

            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser.profilePic || assets.avatar_icon
              }
              alt="profile"
              className={`w-12 h-12 object-cover ${selectedImg && "rounded-full"}`}
            />

            Upload Profile Image
          </label>

          {/* NAME INPUT */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          {/* BIO INPUT */}
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write your bio..."
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          {/* SAVE BUTTON */}
          <button
            type="submit"
            className="py-2 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md"
          >
            Save Profile
          </button>

        </form>

        {/* RIGHT SIDE LARGE PREVIEW IMAGE */}
        <img
  className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
  src={
    selectedImg
      ? URL.createObjectURL(selectedImg)
      : authUser?.profilePic || assets.logo_icon
  }
  alt=""
/>


      </div>
    </div>
  );
};

export default ProfilePage;
