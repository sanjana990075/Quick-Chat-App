import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket } = useContext(AuthContext);

  // -------------------------
  // Get all users
  // -------------------------
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/sidebar");

      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // -------------------------
  // Get chat messages
  // -------------------------
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);

      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // -------------------------
  // Send message
  // -------------------------
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // -------------------------
  // Real-time listener
  // -------------------------
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);

        axios.put(`/api/messages/mark-seen/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]:
            prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    socket?.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return unsubscribeFromMessages;
  }, [socket, selectedUser]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        selectedUser,
        unseenMessages,
        setSelectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setMessages,
        setUnseenMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
