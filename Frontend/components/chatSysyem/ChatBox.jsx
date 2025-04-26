"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import Image from "@node_modules/next/image";
import { ChatContext } from "@providers/chatProvider";
import Link from "@node_modules/next/link";
import { sendNoti } from "@api/noti";
import NotiForm from "./NotiForm";
import { playSound } from "./Playsounds";

const ChatBox = () => {
  const { isShow, setIsShow, socket } = useContext(ChatContext);
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [notifications, SetNotifications] = useState([]);
  const [hasJoinedChat, setHasJoinedChat] = useState(false);
  const [inChatMode, setInChatMode] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [token, setToken] = useState(null);

  const [account_id, setAccountId] = useState("");
  const [hotel_id, setHotelId] = useState("");
  const [role, setRole] = useState("");
  const textareaRef = useRef(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const login = JSON.parse(localStorage.getItem("res_login"));
    setAccountId(login?.account?.id);
    setRole(login?.account?.role);
    setHotelId(login?.account?.hotel_id);
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!socket) return;

    if (role === "user") {
      socket.emit("join_account_id", account_id);
      socket.emit("join_account_booking", account_id);
      socket.emit("join_account_all");
    } else if (role === "hotel_admin" && hotel_id)
      socket.emit("join_hotel_room", hotel_id);

    socket.emit("search_chat", { account_id, hotel_id, role });

    socket.on("my_chat", ({ chats, notifications }) => {
      setChats(chats);
      console.log("chats", chats);
      SetNotifications(notifications);
    });

    socket.on("insert_chat", (incomingChat) => {
      setChats((prevChats) => {
        const existingIndex = prevChats.findIndex(
          (chat) => chat._id === incomingChat._id
        );

        if (existingIndex !== -1) {
          // Remove it from current position
          const updatedChats = [...prevChats];
          updatedChats.splice(existingIndex, 1);
          return [incomingChat, ...updatedChats];
        }

        // If not found, add to the top
        return [incomingChat, ...prevChats];
      });
    });

    socket.on("message_history", ({ messageHistory }) => {
      setMessages(messageHistory);
      setHasJoinedChat(true); // Set flag
    });

    socket.on("receive_message", (incomingMessage) => {
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      
      playSound("/sounds/Chatnoti.mp3"); 
  
    });

    socket.on("receive_notification", (incomingNotification) => {
      SetNotifications((prev) => [...prev, incomingNotification]);
      if (!inChatMode) return; 
      setUnreadCount((prevCount) => prevCount + 1);

      if (incomingNotification.type === "promotion") {
        playSound("/sounds/Promotionnoti.mp3");
      } else if (incomingNotification.type === "emergency") {
        playSound("/sounds/Emernoti.mp3");
      }

    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  // Handle auto sroll
  useEffect(() => {
    if (!hasJoinedChat) return;
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [hasJoinedChat]);

  useEffect(() => {
    if (!inChatMode) {
      setUnreadCount(0);
    }
  }, [inChatMode]);

  // Handle room selection
  const handleRoomSelection = (chatRoom) => {
    setChat(chatRoom);
    socket.emit("join_chat", { chat_id: chatRoom._id });
  };

  const handleUnslelctRoom = () => {
    setChat("");
  };

  // Handle message sending
  const handleSendMessage = () => {
    const newMessage = {
      from: account_id,
      text: message,
      chat_id: chat._id,
    };

    socket.emit("send_message", newMessage);
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "auto";
    }
  };

  // Handle input area
  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px"; // Set to scrollHeight
    }
  };

  if (!chats) return <div>Loading...</div>;

  if (! token)  return (
    <div
      className="hdcard_white border border-gray-300"
      style={{
        borderRadius: "30px",
        position: "fixed",
        width: "300px",
        top: "70px",
        bottom: "60px",
        right: "20px",
        zIndex: "800",
        overflow: "hidden",
        transition: "all 0.5s cubic-bezier(0.34, 1.15, 0.64, 1)",
        pointerEvents: isShow ? "all" : "none",
        scale: isShow ? 1 : 0.1,
        transformOrigin: "bottom right",
        opacity: isShow ? 1 : 0,
      }}
    >
      <div
        className="sub_text2"
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          height: "30px",
          textAlign: "center",
          backgroundColor: "white",
          fontSize: "12px",
          padding: "4px",
        }}
      >
        Customer Support
      </div>
      <Link href="/auth/signin">
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        width:"100%",
      }}>
        <span className="main_bg" style={{color:"white", padding:"5px", paddingLeft:"10px", paddingRight:"10px", borderRadius:"10px"}}>Sign-In</span> to <span className="main_text">Chat</span> with us
      </div>
      </Link>
    </div>
  )
  
  return (
    <div
      className="hdcard_white border border-gray-300"
      style={{
        borderRadius: "30px",
        position: "fixed",
        width: "300px",
        top: "70px",
        bottom: "60px",
        right: "20px",
        zIndex: "800",
        overflow: "hidden",
        transition: "all 0.5s cubic-bezier(0.34, 1.15, 0.64, 1)",
        pointerEvents: isShow ? "all" : "none",
        scale: isShow ? 1 : 0.1,
        transformOrigin: "bottom right",
        opacity: isShow ? 1 : 0,
      }}
    >
      <div
        className="sub_text2"
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          height: "30px",
          textAlign: "center",
          backgroundColor: "white",
          fontSize: "12px",
          padding: "4px",
        }}
      >
        Customer Support
      </div>
      {/* Show room selection if no room is selected */}
      {!chat ? (
        <div
          style={{
            marginTop: "40px",
            padding: "10px",
            height: "calc(100% - 50px)",
            overflowY: "auto",
            borderTop: "1px solid #d1d5db60",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "30px",
              margin: "0",
              position: "relative",
              fontSize: "14px",
            }}
          >
            <div
              onClick={() => {
                setInChatMode(true);
              }}
              className={`${inChatMode ? "main_text" : ""}`}
              style={{
                position: "absolute",
                width: "50%",
                left: "0",
                textAlign: "center",
              }}
            >
              Chat
            </div>
            <div
              onClick={() => {
                setInChatMode(false);
              }}
              className={`${inChatMode ? "" : "main_text"}`}
              style={{
                position: "absolute",
                width: "50%",
                right: "0",
                textAlign: "center",
              }}
            >
              {role === "hotel_admin" || role === "super_admin" ? "Publish" : "Notification"}
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "1px",
                    right: "10%",
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
          <div
            className="hide_scrollbar card_bg2"
            style={{
              position: "absolute",
              top: "80px",
              bottom: "10px",
              borderRadius:"20px",
              paddingBottom: "50px",
              left: "10px",
              right: "10px",
              overflowY: "scroll",
            }}
          >
            {/* Display chat rooms or nontifiaction */}
            {inChatMode ? (
              <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
                {chats?.map((room) => (
                  <li
                    key={room._id}
                    onClick={() => handleRoomSelection(room)}
                    style={{
                      cursor: "pointer",
                      margin: "10px 0",
                      padding: "8px",
                      borderRadius: "5px",
                      display: "flex",
                      alignItems: "center",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Image
                      src={room.hotel_id.image_url}
                      alt={room.hotel_id.name}
                      width={40}
                      height={40}
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'cover',
                        marginRight: '10px',
                        borderRadius: '50%',
                        flexShrink: '0',
                        backgroundColor: 'gray',
                      }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginRight:"0px",
                        width: "calc(100% - 70px)",
                        flexShrink:"0"
                      }}
                    >
                      {role === "hotel_admin" || role === "super_admin"? room.account_id.full_name : room.hotel_id.name} 
                    </span>
                    <img
                  src="/icons/chevron-black.svg"
                  style={{
                    width: "25px",
                    rotate: "180deg",
                    opacity: "0.2",
                  }}
                />
                  </li>
                ))}
              </ul>
            ) : (
              <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>

                {role === "user" ? [...notifications].reverse().map((notification, index) => {
                  const typeColors = {
                    news: "main_bg",
                    emergency: "red_bg",
                    promotion: "main_bg",
                    booking: "un_bg"
                  };
                  const typeEmojis = {
                    news: "📰",
                    emergency: "🚨",
                    promotion: "🏷️",
                    booking: "📅",
                  };
                  const bgClass = typeColors[notification.type] || "main_bg";
                  const emoji = typeEmojis[notification.type] || "🔔";
                  const formattedExpire = notification.expire
                    ? new Date(notification.expire).toLocaleDateString(
                        "en-GB",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )
                    : null;

                  return (
                    <li
                      key={index}
                      className={`${bgClass}`}
                      style={{
                        borderRadius: "10px",
                        boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.1)",
                        padding: "12px",
                        margin: "10px",
                        transition: "transform 0.2s ease-in-out",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#fff",
                          }}
                        >
                          {emoji + " "}
                          {notification.head}
                        </span>
                      </div>
                      {notification.hotel_id?.name && (
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#fff",
                            marginBottom: "6px",
                          }}
                        >
                          🏨 {"  " + notification.hotel_id.name}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#f0f0f0",
                          lineHeight: 1.4,
                        }}
                      >
                        - {notification.detail}
                      </div>
                      {formattedExpire && (
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#e0e0e0",
                            marginTop: "6px",
                            fontStyle: "italic",
                          }}
                        >
                          ⏳ Expires on: {formattedExpire}
                        </div>
                      )}
                    </li>
                  );
                }) : (<div>
                <NotiForm/>
                </div>)}
              </ul>
            )}
          </div>
        </div>
      ) : (
        // Show chat once a room is selected
        <div
          style={{
            top: "40px",
            padding: "10px",
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            borderTop: "1px solid #d1d5db60",
          }}
        >
          <div
            id="chatBox"
            className="hide_scrollbar"
            ref={chatBoxRef}
            style={{
              position: "absolute",
              top: "0",
              bottom: "80px",
              paddingBottom: "50px",
              left: "5px",
              right: "5px",
              overflowY: "scroll",
            }}
          >
            {/* Display messages as chat bubbles */}
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection:
                    msg.from === account_id ? "row-reverse" : "row",
                  marginBottom: "10px",
                  padding: "5px",
                  position: "relative",
                  minHeight: "40px",
                }}
              >
                <div
                  className={`${
                    msg.from === account_id ? "main_bg" : "card_bg2"
                  }`}
                  style={{
                    color: msg.from === account_id ? "white" : "black",
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div
            onClick={handleUnslelctRoom}
            className="align_item_center"
            style={{
              position: "absolute",
              width: "30px",
              height: "30px",
              top: "-35px",
            }}
          >
            <img
              src="/icons/chevron-left-2.svg"
              style={{
                width: "25px",
              }}
            />
          </div>
          <div
            className="card_bg2"
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              right: "10px",
              borderRadius: "20px",
              boxSizing: "border-box",
              padding: "5px",
            }}
          >
            <textarea
              ref={textareaRef}
              rows="1"
              value={message}
              onChange={handleChangeMessage}
              placeholder="Type a message"
              style={{
                width: "calc(100% - 10px)",
                padding: "8px",
                marginBottom: "40px",
                borderRadius: "10px",
                marginTop: "5px",
                border: "none",
                marginLeft: "5px",
                marginRight: "5px",
                overflow: "hidden",
                resize: "none", // Prevent manual resize
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleSendMessage}
              className="main_bg align_item_center"
              style={{
                width: "35px",
                height: "35px",
                color: "white",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                right: "10px",
                bottom: "10px",
                position: "absolute",
              }}
            >
              <img
                src="/icons/send.svg"
                style={{
                  width: "18px",
                  marginRight: "2px",
                  marginTop: "2.5px",
                }}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
