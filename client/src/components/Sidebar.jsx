// components/Sidebar.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/chatContext.jsx";
import assets from "../assets/assets";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // 🔍 Debounced Search (Optimized)
  const filteredUsers = useMemo(() => {
    return search.trim()
      ? users.filter((u) =>
          u.fullName.toLowerCase().includes(search.toLowerCase())
        )
      : users;
  }, [search, users]);

  // ♻️ Refresh list when online users change
  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  const openChat = (user) => {
    setSelectedUser(user);

    // Reset unseen messages for selected user
    setUnseenMessages((prev) => ({
      ...prev,
      [user._id]: 0,
    }));
  };

  return (
    <div
      className={`bg-[#1e1b2e]/80 h-full p-5 rounded-r-xl overflow-y-scroll text-white
      ${selectedUser ? "max-md:hidden" : ""}`}
    >
      {/* -------- Header -------- */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} className="max-w-40" />

          <div className="relative group">
            <img src={assets.menu_icon} className="max-h-5 cursor-pointer" />

            <div className="absolute top-full right-0 w-32 p-4 rounded-md bg-[#282142] border border-gray-600 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>

              <hr className="my-2 border-gray-500" />

              <p
                onClick={logout}
                className="cursor-pointer text-sm text-red-300"
              >
                Log Out
              </p>
            </div>
          </div>
        </div>

        {/* -------- Search -------- */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} className="w-3" />
          <input
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-white text-xs flex-1"
            placeholder="Search users..."
          />
        </div>
      </div>

      {/* -------- User List -------- */}
      <div className="flex flex-col">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => openChat(user)}
            className={`relative flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-[#282142]/40 transition-all ${
              selectedUser?._id === user._id ? "bg-[#282142]/60" : ""
            }`}
          >
            <img
              src={user.profilePic || assets.avatar_icon}
              className="w-[40px] rounded-full border border-white/20"
            />

            <div className="flex flex-col">
              <p>{user.fullName}</p>

              {/* Online indicator */}
              <span
                className={`text-xs ${
                  onlineUsers.includes(user._id)
                    ? "text-green-400"
                    : "text-neutral-400"
                }`}
              >
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </span>
            </div>

            {/* Unseen message count */}
            {unseenMessages[user._id] > 0 && (
              <p className="absolute right-3 top-3 bg-violet-500 text-white rounded-full w-5 h-5 flex justify-center items-center text-xs font-semibold">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <p className="text-center text-sm text-gray-400 mt-5">
          No users found
        </p>
      )}
    </div>
  );
};

export default Sidebar;
