import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/chatContext.jsx";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utiles";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();
  const [input, setInput] = useState("");

  // ---------------- SEND TEXT MESSAGE ---------------- //
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  // ---------------- SEND IMAGE MESSAGE ---------------- //
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select a valid image");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  // Load chat on selecting user
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ---------------- IF NO CHAT SELECTED ---------------- //
  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={assets.logo_icon} className="max-w-16" />
        <p className="text-lg font-medium text-white">
          Chat Anytime, Anywhere
        </p>
      </div>
    );
  }

  // ---------------- MAIN CHAT UI ---------------- //
  return (
    <div className="h-full overflow-hidden relative backdrop-blur-lg">
      {/* ------------ HEADER ------------ */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          className="md:hidden max-w-7 cursor-pointer"
        />
      </div>

      {/* ------------ CHAT MESSAGES ------------ */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-20">
        {messages.map((msg, index) => {
          const isMine = msg.senderId === authUser._id;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 mb-6 ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              {/* -------------- MESSAGE BUBBLE -------------- */}
              {msg.image ? (
                <img
                  src={msg.image}
                  className={`max-w-[230px] rounded-lg border border-gray-700 ${
                    isMine ? "rounded-br-none" : "rounded-bl-none"
                  }`}
                />
              ) : (
                <p
                  className={`p-2 max-w-[220px] md:text-sm break-words text-white
                  ${
                    isMine
                      ? "bg-violet-500/40 rounded-lg rounded-br-none"
                      : "bg-gray-600/40 rounded-lg rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              {/* -------------- AVATAR + TIME -------------- */}
              <div className="text-center text-xs text-gray-400">
                <img
                  src={
                    isMine
                      ? authUser?.profilePic || assets.avatar_icon
                      : selectedUser?.profilePic || assets.avatar_icon
                  }
                  className="w-6 h-6 rounded-full mx-auto"
                />
                <p>{formatMessageTime(msg.createdAt)}</p>
              </div>
            </div>
          );
        })}

        <div ref={scrollEnd}></div>
      </div>

      {/* ------------ INPUT BAR ------------ */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-[#18181B]">
        <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Send a message..."
            className="flex-1 text-sm p-3 bg-transparent text-white outline-none"
          />

          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img src={assets.gallery_icon} className="w-5 mr-2 cursor-pointer" />
          </label>
        </div>

        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ChatContainer;
