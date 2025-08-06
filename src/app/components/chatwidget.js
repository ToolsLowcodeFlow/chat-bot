// "use client";

// import { useState, useRef, useEffect } from "react";
// import { X, MessageSquare, Maximize2, Minimize2, Send } from "lucide-react";
// import { Bot } from "lucide-react";
// import { supabase } from "@/app/lib/supabaseClient";

// export default function ChatWidget() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [sessionId, setSessionId] = useState(null);
//   const messagesEndRef = useRef(null);

//   // Initialize chat session
//   useEffect(() => {
//     const initializeChat = async () => {
//       try {
//         // Create a new session in the database
//         const { data: sessions, error: createError } = await supabase
//           .from('chat_sessions')
//           .insert([{}])
//           .select('session_id');

//         if (createError) {
//           console.error('Error creating session:', createError);
//           return;
//         }

//         // Get the new session_id and store it
//         const newSessionId = sessions[0].session_id;
//         setSessionId(newSessionId);

//         // Start with welcome message
//         setMessages([getWelcomeMessage()]);
//       } catch (error) {
//         console.error('Error initializing chat:', error);
//         // Fallback to just showing welcome message without session
//         setMessages([getWelcomeMessage()]);
//       }
//     };

//     initializeChat();
//   }, []);

//   const getWelcomeMessage = () => ({
//     sender: "bot",
//     text: "Welcome to Browns Autos! I'm MotoMate, your AI assistant. How can I help you find your perfect car today?",
//     created_at: new Date().toISOString()
//   });

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const saveMessage = async (message) => {
//     if (!sessionId) return;
    
//     try {
//       const { error } = await supabase
//         .from('chat_messages')
//         .insert([{
//           session_id: sessionId,
//           sender: message.sender,
//           message: message.text,
//           created_at: new Date().toISOString()
//         }]);
        
//       if (error) console.error('Error saving message:', error);
//     } catch (error) {
//       console.error('Error saving message:', error);
//     }
//   };

//   const handleSend = async () => {
//     if (!input.trim()) return;
    
//     // Create user message object
//     const userMessage = { sender: "user", text: input };
    
//     // Add user message to state and save to DB
//     const newMessages = [...messages, userMessage];
//     setMessages(newMessages);
    
//     // Save message if we have a session
//     if (sessionId) {
//       await saveMessage(userMessage);
//     }
    
//     setInput("");
//     setIsTyping(true);
    
//     // Simulate bot response after a delay
//     setTimeout(async () => {
//       const botResponseText = getBotResponse(userMessage.text);
//       const botMessage = {
//         sender: "bot",
//         text: botResponseText
//       };
      
//       // Add bot response to state and save to DB
//       setMessages([...newMessages, botMessage]);
      
//       // Save message if we have a session
//       if (sessionId) {
//         await saveMessage(botMessage);
//       }
      
//       setIsTyping(false);
//     }, 1000 + Math.random() * 2000);
//   };

//   const getBotResponse = (userInput) => {
//     const inputLower = userInput.toLowerCase();
    
//     if (inputLower.includes("hello") || inputLower.includes("hi")) {
//       return "Hello there! Ready to explore our amazing car collection?";
//     } else if (inputLower.includes("price") || inputLower.includes("cost")) {
//       return "We have vehicles at various price points. Could you tell me your budget range?";
//     } else if (inputLower.includes("test drive")) {
//       return "Absolutely! We'd love to arrange a test drive for you. When would you like to come in?";
//     } else if (inputLower.includes("contact") || inputLower.includes("number")) {
//       return "You can reach us at (555) 123-4567 or visit our showroom at 123 Auto Lane.";
//     } else {
//       const randomResponses = [
//         "I'd be happy to help with that. Could you provide more details?",
//         "We have several options that might interest you. What specific features are you looking for?",
//         "That's a great question! Let me check our inventory for you.",
//         "I can assist with that. Are you looking for new or pre-owned vehicles?"
//       ];
//       return randomResponses[Math.floor(Math.random() * randomResponses.length)];
//     }
//   };

//   return (
//     <div style={{ background: 'transparent !important', pointerEvents: 'auto' }}>
//       {/* Floating Button */}
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="fixed bottom-5 right-5 bg-[#E4B343] text-black p-4 rounded-full shadow-lg hover:bg-[#d1a23c] transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center"
//         >
//           <MessageSquare size={24} />
//         </button>
//       )}
      
//       {/* Chat Window */}
//       {isOpen && (
//         <div className={`fixed ${isExpanded ? "bottom-0 right-0 w-full h-screen max-w-md" : "bottom-5 right-5 w-80 h-96"} bg-[#000000f3] text-white rounded-lg shadow-2xl flex flex-col font-sans overflow-hidden transition-all duration-300 border border-[#E4B343]/30`}>
//           {/* Header */}
//           <div className="bg-gradient-to-r from-[#030303] to-[#000000] text-[#E4B343] p-3 flex justify-between items-center border-b border-[#E4B343]/30">
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <Bot size={20} className="text-[#E4B343]"/>
//                 <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
//               </div>
//               <div>
//                 <div className="font-bold">MotoMate</div>
//                 <div className="text-xs text-gray-300">
//                   {isTyping ? "Typing..." : "Online"}
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button 
//                 onClick={() => setIsExpanded(!isExpanded)} 
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
//               >
//                 {isExpanded ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
//               </button>
//               <button 
//                 onClick={() => setIsOpen(false)} 
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           </div>
          
//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-opacity-95 scrollbar-gold">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}
//               >
//                 <div
//                   className={`p-3 rounded-lg max-w-[85%] text-sm relative ${
//                     msg.sender === "bot"
//                       ? "bg-[#000000] text-gray-100 rounded-tl-none border border-[#E4B343]"
//                       : "bg-[#E4B343] text-black rounded-tr-none"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               </div>
//             ))}
//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="p-3 rounded-lg max-w-[85%] text-sm bg-[#1F2937] text-gray-100 rounded-tl-none border border-gray-700 relative">
//                   <div className="flex space-x-1">
//                     <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
//                     <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
//                     <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
          
//           {/* Input */}
//           <div className="p-3 border-t border-[#E4B343]/30 bg-gradient-to-r from-[#000000] to-[#000000]">
//             <div className="flex items-center bg-[#0B0B0C] rounded-lg border border-gray-700 overflow-hidden">
//               <input
//                 type="text"
//                 placeholder="Ask about our cars..."
//                 className="flex-1 p-3 outline-none text-sm placeholder-gray-400"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSend()}
//               />
//               <button
//                 onClick={handleSend}
//                 disabled={!input.trim()}
//                 className={`p-2 px-3 ${input.trim() ? "text-[#E4B343] hover:text-[#E4B343]/90" : "text-gray-500"}`}
//               >
//                 <Send size={18} color="#ecd6a3" />
//               </button>
//             </div>
//             <div className="text-xs text-gray-400 mt-1 text-center">
//               Browns Autos © {new Date().getFullYear()}
//             </div>
//           </div>
//         </div>
//       )}
//       <style jsx global>{`
//         .scrollbar-gold::-webkit-scrollbar {
//           width: 8px;
//           height: 8px;
//         }
//         .scrollbar-gold::-webkit-scrollbar-track {
//           background: #000000;
//           border-radius: 4px;
//         }
//         .scrollbar-gold::-webkit-scrollbar-thumb {
//           background-color: #E4B343;
//           border-radius: 4px;
//           border: 2px solid #000000;
//         }
//         .scrollbar-gold::-webkit-scrollbar-thumb:hover {
//           background-color: #d1a23c;
//         }
//       `}</style>
//     </div>
//   );
// }



// chat store against browser session id and store in database//




"use client";

import { useState, useRef, useEffect } from "react";
import { X, MessageSquare, Maximize2, Minimize2, Send } from "lucide-react";
import { Bot } from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";
import Image from "next/image";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Initialize chat session
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have an existing session in memory/state
        let existingSessionId = null;
        
        // Try to get session from localStorage (persists across all tabs/windows)
        if (typeof window !== 'undefined') {
          existingSessionId = localStorage.getItem('chatSessionId');
        }

        if (existingSessionId) {
          // Load existing session and messages
          setSessionId(existingSessionId);
          await loadExistingMessages(existingSessionId);
        } else {
          // Create new session
          const { data: sessions, error: createError } = await supabase
            .from('chat_sessions')
            .insert([{}])
            .select('session_id')
            .single();

          if (createError) {
            console.error('Error creating session:', createError);
            // Fallback to timestamp-based session ID
            const fallbackSessionId = Date.now().toString();
            setSessionId(fallbackSessionId);
            if (typeof window !== 'undefined') {
              localStorage.setItem('chatSessionId', fallbackSessionId);
            }
            setMessages([getWelcomeMessage()]);
            setIsLoading(false);
            return;
          }

          // Store new session ID
          const newSessionId = sessions.session_id.toString();
          setSessionId(newSessionId);
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('chatSessionId', newSessionId);
          }

          // Start with welcome message and save it
          const welcomeMessage = getWelcomeMessage();
          setMessages([welcomeMessage]);
          await saveMessage(welcomeMessage, newSessionId);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        // Fallback behavior
        const fallbackSessionId = Date.now().toString();
        setSessionId(fallbackSessionId);
        if (typeof window !== 'undefined') {
          localStorage.setItem('chatSessionId', fallbackSessionId);
        }
        setMessages([getWelcomeMessage()]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, []);

  const loadExistingMessages = async (sessionId) => {
    try {
      const { data: existingMessages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', parseInt(sessionId))
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading existing messages:', error);
        setMessages([getWelcomeMessage()]);
        return;
      }

      if (existingMessages && existingMessages.length > 0) {
        // Convert database messages to component format
        const formattedMessages = existingMessages.map(msg => ({
          sender: msg.sender,
          text: msg.message,
          created_at: msg.created_at
        }));
        setMessages(formattedMessages);
      } else {
        // No existing messages, start with welcome
        const welcomeMessage = getWelcomeMessage();
        setMessages([welcomeMessage]);
        await saveMessage(welcomeMessage, sessionId);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([getWelcomeMessage()]);
    }
  };

  const getWelcomeMessage = () => ({
    sender: "bot",
    text: "Welcome to Browns Autos! I'm MotoMate, your AI assistant. How can I help you find your perfect car today?",
    created_at: new Date().toISOString()
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveMessage = async (message, sessionIdOverride = null) => {
    const currentSessionId = sessionIdOverride || sessionId;
    if (!currentSessionId) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          session_id: parseInt(currentSessionId),
          sender: message.sender,
          message: message.text,
          created_at: new Date().toISOString()
        }]);
        
      if (error) {
        console.error('Error saving message:', error);
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    // Create user message object
    const userMessage = { 
      sender: "user", 
      text: input,
      created_at: new Date().toISOString()
    };
    
    // Add user message to state and save to DB
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    // Save message if we have a session
    if (sessionId) {
      await saveMessage(userMessage);
    }
    
    setInput("");
    setIsTyping(true);
    
    // Simulate bot response after a delay
    setTimeout(async () => {
      const botResponseText = getBotResponse(userMessage.text);
      const botMessage = {
        sender: "bot",
        text: botResponseText,
        created_at: new Date().toISOString()
      };
      
      // Add bot response to state and save to DB
      const updatedMessages = [...newMessages, botMessage];
      setMessages(updatedMessages);
      
      // Save message if we have a session
      if (sessionId) {
        await saveMessage(botMessage);
      }
      
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const getBotResponse = (userInput) => {
    const inputLower = userInput.toLowerCase();
    
    if (inputLower.includes("hello") || inputLower.includes("hi")) {
      return "Hello there! Ready to explore our amazing car collection?";
    } else if (inputLower.includes("price") || inputLower.includes("cost")) {
      return "We have vehicles at various price points. Could you tell me your budget range?";
    } else if (inputLower.includes("test drive")) {
      return "Absolutely! We'd love to arrange a test drive for you. When would you like to come in?";
    } else if (inputLower.includes("contact") || inputLower.includes("number")) {
      return "You can reach us at (555) 123-4567 or visit our showroom at 123 Auto Lane.";
    } else {
      const randomResponses = [
        "I'd be happy to help with that. Could you provide more details?",
        "We have several options that might interest you. What specific features are you looking for?",
        "That's a great question! Let me check our inventory for you.",
        "I can assist with that. Are you looking for new or pre-owned vehicles?"
      ];
      return randomResponses[Math.floor(Math.random() * randomResponses.length)];
    }
  };

  // Function to start a new chat session
  const startNewChat = async () => {
    try {
      // Clear current session
      if (typeof window !== 'undefined') {
        localStorage.removeItem('chatSessionId');
      }
      
      // Create new session
      const { data: sessions, error: createError } = await supabase
        .from('chat_sessions')
        .insert([{}])
        .select('session_id')
        .single();

      if (createError) {
        console.error('Error creating new session:', createError);
        return;
      }

      const newSessionId = sessions.session_id.toString();
      setSessionId(newSessionId);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatSessionId', newSessionId);
      }

      // Reset messages with welcome message
      const welcomeMessage = getWelcomeMessage();
      setMessages([welcomeMessage]);
      await saveMessage(welcomeMessage, newSessionId);
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  return (
    <div style={{ background: 'transparent !important', pointerEvents: 'auto' }}>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 p-4  flex items-center justify-center cursor-pointer bg-transparent"
        >
          {/* <MessageSquare size={24} /> */}
          <Image className="rounded-full" alt="logo" width={60} height={60} src="/motomate_chat.png"/>
        </button>
      )}
      
      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed ${isExpanded ? "bottom-0 right-0 w-full h-screen max-w-md" : "bottom-5 right-5 w-80 h-96"} bg-[#000000f3] text-white rounded-lg shadow-2xl flex flex-col font-sans overflow-hidden transition-all duration-300 border border-[#E4B343]/30`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-[#030303] to-[#000000] text-[#E4B343] p-3 flex justify-between items-center border-b border-[#E4B343]/30">
            <div className="items-center gap-2">
              <div className="relative">
                <span className="absolute right-0 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
          <Image className="bg-transparent" alt="logo" width={120} height={20} src="/motomatechatlogo.png"/>
                {/* <Bot size={20} className="text-[#E4B343]"/> */}
                <div className="mx-1 text-xs text-[#ffffff]">
                  {isLoading ? "Loading..." : isTyping ? "Typing..." : ""}
                </div>
              </div>
              <div>
                {/* <div className="font-bold">MotoMate</div> */}

              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* New Chat Button */}
              <button 
                onClick={startNewChat}
                className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors text-xs"
                title="Start New Chat"
              >
                +
              </button>
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
              >
                {isExpanded ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-opacity-95 scrollbar-gold">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-400">Loading chat history...</div>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-[85%] text-sm relative ${
                        msg.sender === "bot"
                          ? "bg-[#000000] text-gray-100 rounded-tl-none border border-[#E4B343]"
                          : "bg-[#E4B343] text-black rounded-tr-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-lg max-w-[85%] text-sm bg-[#1F2937] text-gray-100 rounded-tl-none border border-gray-700 relative">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-3 border-t border-[#E4B343]/30 bg-gradient-to-r from-[#000000] to-[#000000]">
            <div className="flex items-center bg-[#0B0B0C] rounded-lg border border-gray-700 overflow-hidden">
              <input
                type="text"
                placeholder={isLoading ? "Loading..." : "Ask about our cars..."}
                className="flex-1 p-3 outline-none text-sm placeholder-gray-400 bg-transparent text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`p-2 px-3 ${input.trim() && !isLoading ? "text-[#E4B343] hover:text-[#E4B343]/90" : "text-gray-500"}`}
              >
                <Send size={18} color={input.trim() && !isLoading ? "#ecd6a3" : "#6b7280"} />
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-1 text-center">
              Browns Autos © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        .scrollbar-gold::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .scrollbar-gold::-webkit-scrollbar-track {
          background: #000000;
          border-radius: 4px;
        }
        .scrollbar-gold::-webkit-scrollbar-thumb {
          background-color: #E4B343;
          border-radius: 4px;
          border: 2px solid #000000;
        }
        .scrollbar-gold::-webkit-scrollbar-thumb:hover {
          background-color: #d1a23c;
        }
      `}</style>
    </div>
  );
}


// webhoook api call auto trader with chat bot //

// "use client";

// import { useState, useRef, useEffect } from "react";
// import { X, MessageSquare, Maximize2, Minimize2, Send, Car, RefreshCw } from "lucide-react";
// import { Bot } from "lucide-react";
// import { supabase } from "@/app/lib/supabaseClient";

// export default function AutoTraderChatWidget() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [sessionId, setSessionId] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [vehicleData, setVehicleData] = useState([]);
//   const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Initialize chat and load vehicle data
//   useEffect(() => {
//     initializeChat();
//     loadVehicleData();
//   }, []);

//   const initializeChat = async () => {
//     try {
//       setIsLoading(true);
//       let existingSessionId = null;

//       if (typeof window !== 'undefined') {
//         existingSessionId = localStorage.getItem('chatSessionId');
//       }

//       if (existingSessionId) {
//         setSessionId(existingSessionId);
//         await loadExistingMessages(existingSessionId);
//       } else {
//         const { data: sessions, error: createError } = await supabase
//           .from('chat_sessions')
//           .insert([{}])
//           .select('session_id')
//           .single();

//         if (createError) {
//           const fallbackSessionId = Date.now().toString();
//           setSessionId(fallbackSessionId);
//           if (typeof window !== 'undefined') {
//             localStorage.setItem('chatSessionId', fallbackSessionId);
//           }
//           setMessages([getWelcomeMessage()]);
//           return;
//         }

//         const newSessionId = sessions.session_id.toString();
//         setSessionId(newSessionId);

//         if (typeof window !== 'undefined') {
//           localStorage.setItem('chatSessionId', newSessionId);
//         }

//         const welcomeMessage = getWelcomeMessage();
//         setMessages([welcomeMessage]);
//         await saveMessage(welcomeMessage, newSessionId);
//       }
//     } catch (error) {
//       console.error('Error initializing chat:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Load real vehicle data from Auto Trader API
//   const loadVehicleData = async () => {
//     try {
//       setIsLoadingVehicles(true);
//       const response = await fetch('/api/vehicles/stock');
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch vehicle data');
//       }
      
//       const data = await response.json();
//       setVehicleData(data?.vehicles || data || []);
//     } catch (error) {
//       console.error('Error loading vehicle data:', error);
//       setVehicleData([]);
//     } finally {
//       setIsLoadingVehicles(false);
//     }
//   };

//   // Search vehicles by criteria
//   const searchVehicles = async (searchParams) => {
//     try {
//       const queryString = new URLSearchParams(searchParams).toString();
//       const response = await fetch(`/api/vehicle/search?${queryString}`);
      
//       if (!response.ok) {
//         throw new Error('Failed to search vehicles');
//       }
      
//       const data = await response.json();
//       return data?.vehicles || data || [];
//     } catch (error) {
//       console.error('Error searching vehicles:', error);
//       return [];
//     }
//   };

//   const loadExistingMessages = async (sessionId) => {
//     try {
//       const { data: existingMessages, error } = await supabase
//         .from('chat_messages')
//         .select('*')
//         .eq('session_id', parseInt(sessionId))
//         .order('created_at', { ascending: true });

//       if (error) {
//         setMessages([getWelcomeMessage()]);
//         return;
//       }

//       if (existingMessages && existingMessages.length > 0) {
//         const formattedMessages = existingMessages.map(msg => ({
//           sender: msg.sender,
//           text: msg.message,
//           created_at: msg.created_at
//         }));
//         setMessages(formattedMessages);
//       } else {
//         const welcomeMessage = getWelcomeMessage();
//         setMessages([welcomeMessage]);
//         await saveMessage(welcomeMessage, sessionId);
//       }
//     } catch (error) {
//       console.error('Error loading messages:', error);
//       setMessages([getWelcomeMessage()]);
//     }
//   };

//   const getWelcomeMessage = () => ({
//     sender: "bot",
//     text: "Welcome to Browns Autos Brighton! I'm MotoMate, your AI assistant with direct access to our live Auto Trader inventory. I can help you find the perfect car from our current stock. How can I assist you today?",
//     created_at: new Date().toISOString()
//   });

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const saveMessage = async (message, sessionIdOverride = null) => {
//     const currentSessionId = sessionIdOverride || sessionId;
//     if (!currentSessionId) return;

//     try {
//       await supabase
//         .from('chat_messages')
//         .insert([{
//           session_id: parseInt(currentSessionId),
//           sender: message.sender,
//           message: message.text,
//           created_at: new Date().toISOString()
//         }]);
//     } catch (error) {
//       console.error('Error saving message:', error);
//     }
//   };

//   const handleSend = async () => {
//     if (!input.trim() || isLoading) return;

//     const userMessage = { 
//       sender: "user", 
//       text: input,
//       created_at: new Date().toISOString()
//     };

//     const newMessages = [...messages, userMessage];
//     setMessages(newMessages);

//     if (sessionId) {
//       await saveMessage(userMessage);
//     }

//     const currentInput = input;
//     setInput("");
//     setIsTyping(true);

//     try {
//       const botResponseText = await getBotResponse(currentInput, vehicleData);
      
//       setTimeout(async () => {
//         const botMessage = {
//           sender: "bot",
//           text: botResponseText,
//           created_at: new Date().toISOString()
//         };

//         const updatedMessages = [...newMessages, botMessage];
//         setMessages(updatedMessages);

//         if (sessionId) {
//           await saveMessage(botMessage);
//         }

//         setIsTyping(false);
//       }, 1000 + Math.random() * 1000);
//     } catch (error) {
//       console.error('Error getting bot response:', error);
//       setIsTyping(false);
//     }
//   };

//   // Enhanced bot response with real Auto Trader API data
//   const getBotResponse = async (userInput, vehicleData) => {
//     const inputLower = userInput.toLowerCase();

//     // Refresh data if requested
//     if (inputLower.includes("refresh") || inputLower.includes("update")) {
//       await loadVehicleData();
//       return "I've refreshed our inventory data from Auto Trader. What would you like to know about our current stock?";
//     }

//     // Stock inquiry
//     if (inputLower.includes("available cars") || inputLower.includes("stock") || inputLower.includes("inventory")) {
//       if (vehicleData && vehicleData.length > 0) {
//         const makes = [...new Set(vehicleData.map(car => car.vehicle?.make).filter(Boolean))];
//         const totalCars = vehicleData.length;
//         return `We currently have ${totalCars} vehicles available in our Auto Trader inventory! We stock ${makes.slice(0, 5).join(', ')}${makes.length > 5 ? ' and more' : ''}. What type of car are you looking for?`;
//       }
//       return "Let me check our current Auto Trader inventory for you. We update our stock in real-time.";
//     }

//     // Brand-specific search
//     const brands = ['audi', 'bmw', 'mercedes', 'ford', 'volkswagen', 'toyota', 'honda', 'nissan', 'hyundai', 'kia'];
//     const mentionedBrand = brands.find(brand => inputLower.includes(brand));
    
//     if (mentionedBrand) {
//       const brandCars = vehicleData.filter(car => 
//         car.vehicle?.make?.toLowerCase() === mentionedBrand.toLowerCase()
//       );
      
//       if (brandCars.length > 0) {
//         const models = [...new Set(brandCars.map(car => car.vehicle?.model).filter(Boolean))];
//         const priceRange = brandCars.map(car => car.pricing?.suppliedPrice?.amountGBP).filter(Boolean);
//         const minPrice = Math.min(...priceRange);
//         const maxPrice = Math.max(...priceRange);
        
//         return `Great choice! We have ${brandCars.length} ${mentionedBrand.toUpperCase()} vehicles available including ${models.slice(0, 3).join(', ')}${models.length > 3 ? ' and more' : ''}. Prices range from £${minPrice?.toLocaleString()} to £${maxPrice?.toLocaleString()}. Would you like specific details?`;
//       } else {
//         return `We don't currently have any ${mentionedBrand.toUpperCase()} vehicles in stock, but our inventory updates regularly. Would you like me to suggest similar alternatives?`;
//       }
//     }

//     // Body type search
//     const bodyTypes = ['suv', 'sedan', 'hatchback', 'estate', 'convertible', 'coupe'];
//     const mentionedBodyType = bodyTypes.find(type => inputLower.includes(type));
    
//     if (mentionedBodyType) {
//       const typeCars = vehicleData.filter(car => 
//         car.vehicle?.bodyType?.toLowerCase().includes(mentionedBodyType.toLowerCase())
//       );
      
//       if (typeCars.length > 0) {
//         return `Perfect! We have ${typeCars.length} ${mentionedBodyType} vehicles in our current inventory. They're all available for immediate viewing. Would you like to see specific models and prices?`;
//       }
//     }

//     // Price inquiry
//     if (inputLower.includes("price") || inputLower.includes("cost") || inputLower.includes("budget")) {
//       if (vehicleData && vehicleData.length > 0) {
//         const prices = vehicleData.map(car => car.pricing?.suppliedPrice?.amountGBP).filter(Boolean);
//         if (prices.length > 0) {
//           const minPrice = Math.min(...prices);
//           const maxPrice = Math.max(...prices);
//           const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
//           return `Our current inventory ranges from £${minPrice.toLocaleString()} to £${maxPrice.toLocaleString()}, with an average price of £${avgPrice.toLocaleString()}. What's your budget range?`;
//         }
//       }
//       return "I can help you find vehicles within your budget. What price range are you considering?";
//     }

//     // Fuel type
//     if (inputLower.includes("fuel") || inputLower.includes("petrol") || inputLower.includes("diesel") || 
//         inputLower.includes("electric") || inputLower.includes("hybrid")) {
//       const fuelTypes = [...new Set(vehicleData.map(car => car.vehicle?.fuelType).filter(Boolean))];
//       if (fuelTypes.length > 0) {
//         return `We have various fuel types available: ${fuelTypes.join(', ')}. What type of fuel efficiency are you looking for?`;
//       }
//       return "We stock vehicles with different fuel types. What's your preference?";
//     }

//     // Contact and appointments
//     if (inputLower.includes("test drive") || inputLower.includes("viewing") || inputLower.includes("appointment")) {
//       return "Excellent! I can help arrange a test drive. All our vehicles are available for immediate viewing at our Brighton showroom. When would work best for you? We're open Monday to Saturday.";
//     }

//     if (inputLower.includes("contact") || inputLower.includes("phone") || inputLower.includes("address")) {
//       return "You can reach Browns Autos Brighton at (01273) 123-4567 or visit us at our Brighton showroom. Our Auto Trader inventory is updated in real-time, so what you see here is what's available!";
//     }

//     // Greetings
//     if (inputLower.includes("hello") || inputLower.includes("hi") || inputLower.includes("hey")) {
//       return `Hello! Welcome to Browns Autos Brighton. I have access to our complete Auto Trader inventory with ${vehicleData?.length || 'several'} vehicles currently available. How can I help you find your perfect car?`;
//     }

//     // Default responses
//     const responses = [
//       `I'd be happy to help! Our Auto Trader inventory has ${vehicleData?.length || 'many'} vehicles available. What specific car are you looking for?`,
//       "Great question! I can search our real-time Auto Trader stock for you. Could you tell me more about what you're looking for?",
//       "I'm here to help you find the perfect car from our Brighton showroom. What type of vehicle interests you?",
//       "Let me assist you with that. Our inventory is updated live from Auto Trader. What can I help you find?"
//     ];
    
//     return responses[Math.floor(Math.random() * responses.length)];
//   };

//   const startNewChat = async () => {
//     try {
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('chatSessionId');
//       }

//       const { data: sessions, error: createError } = await supabase
//         .from('chat_sessions')
//         .insert([{}])
//         .select('session_id')
//         .single();

//       if (!createError) {
//         const newSessionId = sessions.session_id.toString();
//         setSessionId(newSessionId);

//         if (typeof window !== 'undefined') {
//           localStorage.setItem('chatSessionId', newSessionId);
//         }

//         const welcomeMessage = getWelcomeMessage();
//         setMessages([welcomeMessage]);
//         await saveMessage(welcomeMessage, newSessionId);
//       }
//     } catch (error) {
//       console.error('Error starting new chat:', error);
//     }
//   };

//   return (
//     <div style={{ background: 'transparent !important', pointerEvents: 'auto' }}>
//       {/* Floating Button */}
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="fixed bottom-5 right-5 bg-[#E4B343] text-black p-4 rounded-full shadow-lg hover:bg-[#d1a23c] transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center"
//         >
//           <MessageSquare size={24} />
//           <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
//         </button>
//       )}

//       {/* Chat Window */}
//       {isOpen && (
//         <div className={`fixed ${isExpanded ? "bottom-0 right-0 w-full h-screen max-w-md" : "bottom-5 right-5 w-80 h-96"} bg-[#000000f3] text-white rounded-lg shadow-2xl flex flex-col font-sans overflow-hidden transition-all duration-300 border border-[#E4B343]/30`}>
//           {/* Header */}
//           <div className="bg-gradient-to-r from-[#030303] to-[#000000] text-[#E4B343] p-3 flex justify-between items-center border-b border-[#E4B343]/30">
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <Bot size={20} className="text-[#E4B343]"/>
//                 <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
//               </div>
//               <div>
//                 <div className="font-bold">MotoMate</div>
//                 <div className="text-xs text-gray-300">
//                   {isLoading ? "Loading..." : isTyping ? "Typing..." : 
//                    isLoadingVehicles ? "Updating stock..." : 
//                    `Live • ${vehicleData?.length || 0} cars available`}
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button 
//                 onClick={loadVehicleData}
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
//                 title="Refresh Stock"
//                 disabled={isLoadingVehicles}
//               >
//                 <RefreshCw size={14} className={isLoadingVehicles ? "animate-spin" : ""} />
//               </button>
//               <button 
//                 onClick={startNewChat}
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors text-xs"
//                 title="Start New Chat"
//               >
//                 +
//               </button>
//               <button 
//                 onClick={() => setIsExpanded(!isExpanded)} 
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
//               >
//                 {isExpanded ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
//               </button>
//               <button 
//                 onClick={() => setIsOpen(false)} 
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-opacity-95 scrollbar-gold">
//             {isLoading ? (
//               <div className="flex justify-center items-center h-full">
//                 <div className="text-gray-400">Loading chat and inventory...</div>
//               </div>
//             ) : (
//               <>
//                 {messages.map((msg, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}
//                   >
//                     <div
//                       className={`p-3 rounded-lg max-w-[85%] text-sm relative ${
//                         msg.sender === "bot"
//                           ? "bg-[#000000] text-gray-100 rounded-tl-none border border-[#E4B343]"
//                           : "bg-[#E4B343] text-black rounded-tr-none"
//                       }`}
//                     >
//                       {msg.text}
//                     </div>
//                   </div>
//                 ))}
//                 {isTyping && (
//                   <div className="flex justify-start">
//                     <div className="p-3 rounded-lg max-w-[85%] text-sm bg-[#1F2937] text-gray-100 rounded-tl-none border border-gray-700 relative">
//                       <div className="flex space-x-1">
//                         <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
//                         <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
//                         <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input */}
//           <div className="p-3 border-t border-[#E4B343]/30 bg-gradient-to-r from-[#000000] to-[#000000]">
//             <div className="flex items-center bg-[#0B0B0C] rounded-lg border border-gray-700 overflow-hidden">
//               <input
//                 type="text"
//                 placeholder={isLoading ? "Loading..." : "Ask about our Auto Trader inventory..."}
//                 className="flex-1 p-3 outline-none text-sm placeholder-gray-400 bg-transparent text-white"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                 disabled={isLoading}
//               />
//               <button
//                 onClick={handleSend}
//                 disabled={!input.trim() || isLoading}
//                 className={`p-2 px-3 ${input.trim() && !isLoading ? "text-[#E4B343] hover:text-[#E4B343]/90" : "text-gray-500"}`}
//               >
//                 <Send size={18} color={input.trim() && !isLoading ? "#ecd6a3" : "#6b7280"} />
//               </button>
//             </div>
//             <div className="text-xs text-gray-400 mt-1 text-center">
//               Browns Autos Brighton © {new Date().getFullYear()} • Auto Trader Live Inventory
//             </div>
//           </div>
//         </div>
//       )}
//       <style jsx global>{`
//         .scrollbar-gold::-webkit-scrollbar {
//           width: 8px;
//           height: 8px;
//         }
//         .scrollbar-gold::-webkit-scrollbar-track {
//           background: #000000;
//           border-radius: 4px;
//         }
//         .scrollbar-gold::-webkit-scrollbar-thumb {
//           background-color: #E4B343;
//           border-radius: 4px;
//           border: 2px solid #000000;
//         }
//         .scrollbar-gold::-webkit-scrollbar-thumb:hover {
//           background-color: #d1a23c;
//         }
//       `}</style>
//     </div>
//   );
// }