import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/chatContext.jsx";
import assets from "../assets/assets";

const RightSideBar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const [msgImages, setMsgImages] = useState([]);

  // Extract all media images from messages
  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div
      className={`bg-[#818582]/10 text-white w-full relative overflow-y-scroll 
      max-md:hidden`}
    >
      {/* User Header */}
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt=""
          className="w-20 aspect-[1/1] rounded-full object-cover"
        />

        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
          {selectedUser.fullName}
        </h1>

        <p className="px-10 mx-auto opacity-80">{selectedUser.bio}</p>
      </div>

      <hr className="border-[#ffffff50] my-4" />

      {/* Media Section */}
      <div className="px-5 text-xs">
        <p className="font-semibold opacity-90">Media</p>

        <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-90">
          {msgImages.length > 0 ? (
            msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="cursor-pointer rounded-md"
              >
                <img
                  src={url}
                  alt=""
                  className="rounded-md border border-gray-700"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 mt-4">No media shared yet</p>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r 
        from-purple-400 to-violet-600 text-white text-sm font-light py-2 px-20 
        rounded-full cursor-pointer"
      >
        Log Out
      </button>
    </div>
  );
};

export default RightSideBar;
