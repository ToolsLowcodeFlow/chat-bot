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




// "use client";

// import { useState, useRef, useEffect } from "react";
// import { X,Maximize2, Minimize2, Send } from "lucide-react";
// import { supabase } from "@/app/lib/supabaseClient";
// import Image from "next/image";

// export default function ChatWidget() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [sessionId, setSessionId] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const messagesEndRef = useRef(null);

//   // Initialize chat session
//   useEffect(() => {
//     const initializeChat = async () => {
//       try {
//         setIsLoading(true);
        
//         // Check if we have an existing session in memory/state
//         let existingSessionId = null;
        
//         // Try to get session from localStorage (persists across all tabs/windows)
//         if (typeof window !== 'undefined') {
//           existingSessionId = localStorage.getItem('chatSessionId');
//         }

//         if (existingSessionId) {
//           // Load existing session and messages
//           setSessionId(existingSessionId);
//           await loadExistingMessages(existingSessionId);
//         } else {
//           // Create new session
//           const { data: sessions, error: createError } = await supabase
//             .from('chat_sessions')
//             .insert([{}])
//             .select('session_id')
//             .single();

//           if (createError) {
//             console.error('Error creating session:', createError);
//             // Fallback to timestamp-based session ID
//             const fallbackSessionId = Date.now().toString();
//             setSessionId(fallbackSessionId);
//             if (typeof window !== 'undefined') {
//               localStorage.setItem('chatSessionId', fallbackSessionId);
//             }
//             setMessages([getWelcomeMessage()]);
//             setIsLoading(false);
//             return;
//           }

//           // Store new session ID
//           const newSessionId = sessions.session_id.toString();
//           setSessionId(newSessionId);
          
//           if (typeof window !== 'undefined') {
//             localStorage.setItem('chatSessionId', newSessionId);
//           }

//           // Start with welcome message and save it
//           const welcomeMessage = getWelcomeMessage();
//           setMessages([welcomeMessage]);
//           await saveMessage(welcomeMessage, newSessionId);
//         }
//       } catch (error) {
//         console.error('Error initializing chat:', error);
//         // Fallback behavior
//         const fallbackSessionId = Date.now().toString();
//         setSessionId(fallbackSessionId);
//         if (typeof window !== 'undefined') {
//           localStorage.setItem('chatSessionId', fallbackSessionId);
//         }
//         setMessages([getWelcomeMessage()]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeChat();
//   }, []);

//   const loadExistingMessages = async (sessionId) => {
//     try {
//       const { data: existingMessages, error } = await supabase
//         .from('chat_messages')
//         .select('*')
//         .eq('session_id', parseInt(sessionId))
//         .order('created_at', { ascending: true });

//       if (error) {
//         console.error('Error loading existing messages:', error);
//         setMessages([getWelcomeMessage()]);
//         return;
//       }

//       if (existingMessages && existingMessages.length > 0) {
//         // Convert database messages to component format
//         const formattedMessages = existingMessages.map(msg => ({
//           sender: msg.sender,
//           text: msg.message,
//           created_at: msg.created_at
//         }));
//         setMessages(formattedMessages);
//       } else {
//         // No existing messages, start with welcome
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
//     text: "Welcome to Browns Autos! I'm MotoMate, your AI assistant. How can I help you find your perfect car today?",
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
//       const { error } = await supabase
//         .from('chat_messages')
//         .insert([{
//           session_id: parseInt(currentSessionId),
//           sender: message.sender,
//           message: message.text,
//           created_at: new Date().toISOString()
//         }]);
        
//       if (error) {
//         console.error('Error saving message:', error);
//       }
//     } catch (error) {
//       console.error('Error saving message:', error);
//     }
//   };

//   const handleSend = async () => {
//     if (!input.trim() || isLoading) return;
    
//     // Create user message object
//     const userMessage = { 
//       sender: "user", 
//       text: input,
//       created_at: new Date().toISOString()
//     };
    
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
//         text: botResponseText,
//         created_at: new Date().toISOString()
//       };
      
//       // Add bot response to state and save to DB
//       const updatedMessages = [...newMessages, botMessage];
//       setMessages(updatedMessages);
      
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

//   // Function to start a new chat session
//   const startNewChat = async () => {
//     try {
//       // Clear current session
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('chatSessionId');
//       }
      
//       // Create new session
//       const { data: sessions, error: createError } = await supabase
//         .from('chat_sessions')
//         .insert([{}])
//         .select('session_id')
//         .single();

//       if (createError) {
//         console.error('Error creating new session:', createError);
//         return;
//       }

//       const newSessionId = sessions.session_id.toString();
//       setSessionId(newSessionId);
      
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('chatSessionId', newSessionId);
//       }

//       // Reset messages with welcome message
//       const welcomeMessage = getWelcomeMessage();
//       setMessages([welcomeMessage]);
//       await saveMessage(welcomeMessage, newSessionId);
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
//           className="fixed bottom-5 right-5 p-4  flex items-center justify-center cursor-pointer bg-transparent"
//         >
//           {/* <MessageSquare size={24} /> */}
//           <Image className="rounded-full" alt="logo" width={60} height={60} src="/motomate_chat.png"/>
//         </button>
//       )}
      
//       {/* Chat Window */}
//       {isOpen && (
//         <div className={`fixed ${isExpanded ? "bottom-0 right-0 h-screen max-w-md" : "bottom-5 right-5 w-80 h-96"} bg-[#000000f3] text-white rounded-lg shadow-2xl flex flex-col font-sans overflow-hidden transition-all duration-300 border border-[#E4B343]/30`}>
//           {/* Header */}
//           <div className="bg-gradient-to-r from-[#030303] to-[#000000] text-[#E4B343] p-3 flex justify-between items-center border-b border-[#E4B343]/30">
//             <div className="items-center gap-2">
//               <div className="relative">
//                 <span className="absolute right-0 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
//           <Image className="bg-transparent" alt="logo" width={120} height={20} src="/motomatechatlogo.png"/>
//                 {/* <Bot size={20} className="text-[#E4B343]"/> */}
//                 <div className="mx-1 text-xs text-[#ffffff]">
//                   {isLoading ? "Loading..." : isTyping ? "Typing..." : ""}
//                 </div>
//               </div>
//               <div>
//                 {/* <div className="font-bold">MotoMate</div> */}

//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               {/* New Chat Button */}
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
//                 <div className="text-gray-400">Loading chat history...</div>
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
//                 placeholder={isLoading ? "Loading..." : "Ask about our cars..."}
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


// ///////////////////////////////////// Mind studio chat agent integrated and chat widget //////////////////////////////////////
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { X, Maximize2, Minimize2, Send } from "lucide-react";
// import { supabase } from "@/app/lib/supabaseClient";
// import Image from "next/image";

// // MindStudio API constants
// const MINDSTUDIO_API_KEY = "skdaAVlInMo8OGiC2S0O60oKgqeUC4AY6MYYKusMYSAQqeuS0oKoGeiUy0mCWWeC8gOeawUsW4AkCmkqMquW4Oma";
// const MINDSTUDIO_WORKER_ID = "5ac66178-46ae-4bbd-97cd-81add50d0651";
// const MINDSTUDIO_WORKFLOW = "Main.flow";

// export default function ChatWidget() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [sessionId, setSessionId] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const initializeChat = async () => {
//       try {
//         setIsLoading(true);
//         let existingSessionId = null;
//         if (typeof window !== "undefined") {
//           existingSessionId = localStorage.getItem("chatSessionId");
//         }

//         if (existingSessionId) {
//           setSessionId(existingSessionId);
//           await loadExistingMessages(existingSessionId);
//         } else {
//           const { data: sessions, error: createError } = await supabase
//             .from("chat_sessions")
//             .insert([{}])
//             .select("session_id")
//             .single();

//           if (createError) {
//             console.error("Error creating session:", createError);
//             const fallbackSessionId = Date.now().toString();
//             setSessionId(fallbackSessionId);
//             if (typeof window !== "undefined") {
//               localStorage.setItem("chatSessionId", fallbackSessionId);
//             }
//             setMessages([getWelcomeMessage()]);
//             setIsLoading(false);
//             return;
//           }

//           const newSessionId = sessions.session_id.toString();
//           setSessionId(newSessionId);
//           if (typeof window !== "undefined") {
//             localStorage.setItem("chatSessionId", newSessionId);
//           }

//           const welcomeMessage = getWelcomeMessage();
//           setMessages([welcomeMessage]);
//           await saveMessage(welcomeMessage, newSessionId);
//         }
//       } catch (error) {
//         console.error("Error initializing chat:", error);
//         const fallbackSessionId = Date.now().toString();
//         setSessionId(fallbackSessionId);
//         if (typeof window !== "undefined") {
//           localStorage.setItem("chatSessionId", fallbackSessionId);
//         }
//         setMessages([getWelcomeMessage()]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeChat();
//   }, []);

//   const loadExistingMessages = async (sessionId) => {
//     try {
//       const { data: existingMessages, error } = await supabase
//         .from("chat_messages")
//         .select("*")
//         .eq("session_id", parseInt(sessionId))
//         .order("created_at", { ascending: true });

//       if (error) {
//         console.error("Error loading existing messages:", error);
//         setMessages([getWelcomeMessage()]);
//         return;
//       }

//       if (existingMessages && existingMessages.length > 0) {
//         const formattedMessages = existingMessages.map((msg) => ({
//           sender: msg.sender,
//           text: msg.message,
//           created_at: msg.created_at,
//         }));
//         setMessages(formattedMessages);
//       } else {
//         const welcomeMessage = getWelcomeMessage();
//         setMessages([welcomeMessage]);
//         await saveMessage(welcomeMessage, sessionId);
//       }
//     } catch (error) {
//       console.error("Error loading messages:", error);
//       setMessages([getWelcomeMessage()]);
//     }
//   };

//   const getWelcomeMessage = () => ({
//     sender: "bot",
//     text: "Welcome to Browns Autos! I'm MotoMate, your AI assistant. How can I help you find your perfect car today?",
//     created_at: new Date().toISOString(),
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
//       const { error } = await supabase.from("chat_messages").insert([
//         {
//           session_id: parseInt(currentSessionId),
//           sender: message.sender,
//           message: message.text,
//           created_at: new Date().toISOString(),
//         },
//       ]);

//       if (error) {
//         console.error("Error saving message:", error);
//       }
//     } catch (error) {
//       console.error("Error saving message:", error);
//     }
//   };

//   // MindStudio API call
//   const fetchMindStudioResponse = async (userInput) => {
//     try {
//       const response = await fetch(
//         "https://v1.mindstudio-api.com/developer/v2/agents/run",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${MINDSTUDIO_API_KEY}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             workerId: MINDSTUDIO_WORKER_ID,
//             user_prompt: { variable: userInput },
//             workflow: MINDSTUDIO_WORKFLOW,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data?.success) {
//         return data.result || "I'm not sure how to answer that.";
//       } else {
//         return "Sorry, I couldn't process that request.";
//       }
//     } catch (error) {
//       console.error("MindStudio API error:", error);
//       return "Oops! Something went wrong while contacting our AI.";
//     }
//   };

//   const handleSend = async () => {
//     if (!input.trim() || isLoading) return;

//     const userMessage = {
//       sender: "user",
//       text: input,
//       created_at: new Date().toISOString(),
//     };

//     const newMessages = [...messages, userMessage];
//     setMessages(newMessages);

//     if (sessionId) {
//       await saveMessage(userMessage);
//     }

//     setInput("");
//     setIsTyping(true);

//     // Get bot response from MindStudio
//     const botResponseText = await fetchMindStudioResponse(userMessage.text);

//     const botMessage = {
//       sender: "bot",
//       text: botResponseText,
//       created_at: new Date().toISOString(),
//     };

//     const updatedMessages = [...newMessages, botMessage];
//     setMessages(updatedMessages);

//     if (sessionId) {
//       await saveMessage(botMessage);
//     }

//     setIsTyping(false);
//   };

//   const startNewChat = async () => {
//     try {
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("chatSessionId");
//       }

//       const { data: sessions, error: createError } = await supabase
//         .from("chat_sessions")
//         .insert([{}])
//         .select("session_id")
//         .single();

//       if (createError) {
//         console.error("Error creating new session:", createError);
//         return;
//       }

//       const newSessionId = sessions.session_id.toString();
//       setSessionId(newSessionId);
//       if (typeof window !== "undefined") {
//         localStorage.setItem("chatSessionId", newSessionId);
//       }

//       const welcomeMessage = getWelcomeMessage();
//       setMessages([welcomeMessage]);
//       await saveMessage(welcomeMessage, newSessionId);
//     } catch (error) {
//       console.error("Error starting new chat:", error);
//     }
//   };

//   return (
//     <div style={{ background: "transparent !important", pointerEvents: "auto" }}>
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="fixed bottom-5 right-5 p-4 flex items-center justify-center cursor-pointer bg-transparent"
//         >
//           <Image
//             className="rounded-full"
//             alt="logo"
//             width={60}
//             height={60}
//             src="/motomate_chat.png"
//           />
//         </button>
//       )}

//       {isOpen && (
//         <div
//           className={`fixed ${
//             isExpanded
//               ? "bottom-0 right-0 h-screen max-w-md"
//               : "bottom-5 right-5 w-80 h-96"
//           } bg-[#000000f3] text-white rounded-lg shadow-2xl flex flex-col font-sans overflow-hidden transition-all duration-300 border border-[#E4B343]/30`}
//         >
//           <div className="bg-gradient-to-r from-[#030303] to-[#000000] text-[#E4B343] p-3 flex justify-between items-center border-b border-[#E4B343]/30">
//             <div className="items-center gap-2">
//               <div className="relative">
//                 <span className="absolute right-0 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
//                 <Image
//                   className="bg-transparent"
//                   alt="logo"
//                   width={120}
//                   height={20}
//                   src="/motomatechatlogo.png"
//                 />
//                 <div className="mx-1 text-xs text-[#ffffff]">
//                   {isLoading ? "Loading..." : isTyping ? "Typing..." : ""}
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
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
//                 {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
//               </button>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           </div>

//           <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-opacity-95 scrollbar-gold">
//             {isLoading ? (
//               <div className="flex justify-center items-center h-full">
//                 <div className="text-gray-400">Loading chat history...</div>
//               </div>
//             ) : (
//               <>
//                 {messages.map((msg, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${
//                       msg.sender === "bot" ? "justify-start" : "justify-end"
//                     }`}
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
//                         <div
//                           className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                           style={{ animationDelay: "0.2s" }}
//                         ></div>
//                         <div
//                           className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                           style={{ animationDelay: "0.4s" }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           <div className="p-3 border-t border-[#E4B343]/30 bg-gradient-to-r from-[#000000] to-[#000000]">
//             <div className="flex items-center bg-[#0B0B0C] rounded-lg border border-gray-700 overflow-hidden">
//               <input
//                 type="text"
//                 placeholder={
//                   isLoading ? "Loading..." : "Ask about our cars..."
//                 }
//                 className="flex-1 p-3 outline-none text-sm placeholder-gray-400 bg-transparent text-white"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                 disabled={isLoading}
//               />
//               <button
//                 onClick={handleSend}
//                 disabled={!input.trim() || isLoading}
//                 className={`p-2 px-3 ${
//                   input.trim() && !isLoading
//                     ? "text-[#E4B343] hover:text-[#E4B343]/90"
//                     : "text-gray-500"
//                 }`}
//               >
//                 <Send
//                   size={18}
//                   color={
//                     input.trim() && !isLoading ? "#ecd6a3" : "#6b7280"
//                   }
//                 />
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
//           background-color: #e4b343;
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
// /////////////////////////////this code is for perfect integration with mindstudio generated with claude result chat widget integrationm 1 and with Main.flow///////////////////////
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { X, Maximize2, Minimize2, Send, RotateCcw } from "lucide-react";
// import { supabase } from "@/app/lib/supabaseClient";
// import Image from "next/image";

// // Remove direct API constants - now handled by API route

// export default function ChatWidget() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [sessionId, setSessionId] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const messagesEndRef = useRef(null);

//   // Initialize chat on component mount
//   useEffect(() => {
//     const initializeChat = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
        
//         let existingSessionId = null;
//         if (typeof window !== "undefined") {
//           existingSessionId = localStorage.getItem("chatSessionId");
//         }

//         if (existingSessionId) {
//           setSessionId(existingSessionId);
//           await loadExistingMessages(existingSessionId);
//         } else {
//           await createNewSession();
//         }
//       } catch (error) {
//         console.error("Error initializing chat:", error);
//         setError("Failed to initialize chat");
//         // Fallback to local session
//         const fallbackSessionId = `local_${Date.now()}`;
//         setSessionId(fallbackSessionId);
//         if (typeof window !== "undefined") {
//           localStorage.setItem("chatSessionId", fallbackSessionId);
//         }
//         setMessages([getWelcomeMessage()]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeChat();
//   }, []);

//   // Create new session
//   const createNewSession = async () => {
//     try {
//       const { data: session, error: createError } = await supabase
//         .from("chat_sessions")
//         .insert([{ created_at: new Date().toISOString() }])
//         .select("session_id")
//         .single();

//       if (createError) {
//         throw createError;
//       }

//       const newSessionId = session.session_id.toString();
//       setSessionId(newSessionId);
      
//       if (typeof window !== "undefined") {
//         localStorage.setItem("chatSessionId", newSessionId);
//       }

//       const welcomeMessage = getWelcomeMessage();
//       setMessages([welcomeMessage]);
//       await saveMessage(welcomeMessage, newSessionId);
//     } catch (error) {
//       console.error("Error creating new session:", error);
//       throw error;
//     }
//   };

//   // Load existing messages
//   const loadExistingMessages = async (sessionId) => {
//     try {
//       const { data: existingMessages, error } = await supabase
//         .from("chat_messages")
//         .select("*")
//         .eq("session_id", parseInt(sessionId))
//         .order("created_at", { ascending: true });

//       if (error) {
//         console.error("Error loading existing messages:", error);
//         setMessages([getWelcomeMessage()]);
//         return;
//       }

//       if (existingMessages && existingMessages.length > 0) {
//         const formattedMessages = existingMessages.map((msg) => ({
//           id: msg.id,
//           sender: msg.sender,
//           text: msg.message,
//           created_at: msg.created_at,
//         }));
//         setMessages(formattedMessages);
//       } else {
//         const welcomeMessage = getWelcomeMessage();
//         setMessages([welcomeMessage]);
//         await saveMessage(welcomeMessage, sessionId);
//       }
//     } catch (error) {
//       console.error("Error loading messages:", error);
//       setMessages([getWelcomeMessage()]);
//     }
//   };

//   // Get welcome message
//   const getWelcomeMessage = () => ({
//     id: `welcome_${Date.now()}`,
//     sender: "bot",
//     text: "Welcome to Browns Autos! I'm MotoMate, your AI assistant. How can I help you find your perfect car today?",
//     created_at: new Date().toISOString(),
//   });

//   // Scroll to bottom
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     if (messages.length > 0) {
//       scrollToBottom();
//     }
//   }, [messages]);

//   // Save message to database
//   const saveMessage = async (message, sessionIdOverride = null) => {
//     const currentSessionId = sessionIdOverride || sessionId;
//     if (!currentSessionId || currentSessionId.startsWith('local_')) return;

//     try {
//       const { error } = await supabase.from("chat_messages").insert([
//         {
//           session_id: parseInt(currentSessionId),
//           sender: message.sender,
//           message: message.text,
//           created_at: message.created_at || new Date().toISOString(),
//         },
//       ]);

//       if (error) {
//         console.error("Error saving message:", error);
//       }
//     } catch (error) {
//       console.error("Error saving message:", error);
//     }
//   };

//   // MindStudio API call through Next.js API route
//   const fetchMindStudioResponse = async (userInput) => {
//     try {
//       const response = await fetch('/api/chat/mindstudio', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_prompt: userInput
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `API request failed with status ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (data?.success && data?.result) {
//         return data.result;
//       } else if (data?.error) {
//         console.error("MindStudio API error:", data.error);
//         return "I'm experiencing some technical difficulties. Please try again.";
//       } else {
//         return "I'm not sure how to answer that. Could you please rephrase your question?";
//       }
//     } catch (error) {
//       console.error("MindStudio API error:", error);
      
//       if (error.name === 'TypeError' && error.message.includes('fetch')) {
//         return "I'm having trouble connecting to my AI service. Please check your internet connection and try again.";
//       } else if (error.message.includes('Failed to fetch')) {
//         return "Network error. Please check your internet connection and try again.";
//       } else if (error.message.includes('401')) {
//         return "Authentication error with AI service. Please contact support.";
//       } else if (error.message.includes('429')) {
//         return "I'm receiving too many requests right now. Please wait a moment and try again.";
//       } else if (error.message.includes('503')) {
//         return "AI service is temporarily unavailable. Please try again in a moment.";
//       } else {
//         return "Oops! Something went wrong while processing your request. Please try again.";
//       }
//     }
//   };

//   // Handle send message
//   const handleSend = async () => {
//     const trimmedInput = input.trim();
//     if (!trimmedInput || isLoading || isTyping) return;

//     const userMessage = {
//       id: `user_${Date.now()}`,
//       sender: "user",
//       text: trimmedInput,
//       created_at: new Date().toISOString(),
//     };

//     // Add user message immediately
//     setMessages(prevMessages => [...prevMessages, userMessage]);
//     setInput("");
//     setIsTyping(true);
//     setError(null);

//     // Save user message
//     if (sessionId) {
//       await saveMessage(userMessage);
//     }

//     try {
//       // Get bot response from MindStudio
//       const botResponseText = await fetchMindStudioResponse(trimmedInput);

//       const botMessage = {
//         id: `bot_${Date.now()}`,
//         sender: "bot",
//         text: botResponseText,
//         created_at: new Date().toISOString(),
//       };

//       // Add bot message
//       setMessages(prevMessages => [...prevMessages, botMessage]);

//       // Save bot message
//       if (sessionId) {
//         await saveMessage(botMessage);
//       }
//     } catch (error) {
//       console.error("Error in handleSend:", error);
//       const errorMessage = {
//         id: `error_${Date.now()}`,
//         sender: "bot",
//         text: "I'm sorry, I encountered an error processing your message. Please try again.",
//         created_at: new Date().toISOString(),
//       };
//       setMessages(prevMessages => [...prevMessages, errorMessage]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   // Start new chat
//   const startNewChat = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
      
//       // Clear local storage
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("chatSessionId");
//       }

//       // Create new session
//       await createNewSession();
//     } catch (error) {
//       console.error("Error starting new chat:", error);
//       setError("Failed to start new chat");
      
//       // Fallback to local session
//       const fallbackSessionId = `local_${Date.now()}`;
//       setSessionId(fallbackSessionId);
//       if (typeof window !== "undefined") {
//         localStorage.setItem("chatSessionId", fallbackSessionId);
//       }
//       setMessages([getWelcomeMessage()]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle key press
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div style={{ background: "transparent !important", pointerEvents: "auto" }}>
//       {/* Chat trigger button */}
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="fixed bottom-5 right-5 p-4 flex items-center justify-center cursor-pointer bg-transparent hover:scale-110 transition-transform duration-200"
//           title="Open MotoMate Chat"
//         >
//           <Image
//             className="rounded-full shadow-lg"
//             alt="MotoMate Chat"
//             width={60}
//             height={60}
//             src="/motomate_chat.png"
//           />
//         </button>
//       )}

//       {/* Chat window */}
//       {isOpen && (
//         <div
//           className={`fixed ${
//             isExpanded
//               ? "bottom-0 right-0 h-screen max-w-md w-full"
//               : "bottom-5 right-5 w-80 h-96"
//           } bg-[#000000f3] text-white rounded-lg shadow-2xl flex flex-col font-sans overflow-hidden transition-all duration-300 border border-[#E4B343]/30 z-50`}
//         >
//           {/* Header */}
//           <div className="bg-gradient-to-r from-[#030303] to-[#000000] text-[#E4B343] p-3 flex justify-between items-center border-b border-[#E4B343]/30">
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
//                 <Image
//                   className="bg-transparent"
//                   alt="MotoMate Logo"
//                   width={120}
//                   height={20}
//                   src="/motomatechatlogo.png"
//                 />
//               </div>
//               <div className="text-xs text-[#ffffff]">
//                 {isLoading ? "Loading..." : isTyping ? "Typing..." : "Online"}
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={startNewChat}
//                 disabled={isLoading}
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
//                 title="Start New Chat"
//               >
//                 <RotateCcw size={16} />
//               </button>
//               <button
//                 onClick={() => setIsExpanded(!isExpanded)}
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
//                 title={isExpanded ? "Minimize" : "Expand"}
//               >
//                 {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
//               </button>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
//                 title="Close Chat"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           </div>

//           {/* Messages area */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-opacity-95 scrollbar-gold">
//             {isLoading ? (
//               <div className="flex justify-center items-center h-full">
//                 <div className="text-gray-400">Loading chat history...</div>
//               </div>
//             ) : (
//               <>
//                 {error && (
//                   <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
//                     {error}
//                   </div>
//                 )}
                
//                 {messages.map((msg) => (
//                   <div
//                     key={msg.id || `${msg.sender}_${msg.created_at}`}
//                     className={`flex ${
//                       msg.sender === "bot" ? "justify-start" : "justify-end"
//                     }`}
//                   >
//                     <div
//                       className={`p-3 rounded-lg max-w-[85%] text-sm relative break-words ${
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
//                         <div
//                           className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                           style={{ animationDelay: "0.2s" }}
//                         ></div>
//                         <div
//                           className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                           style={{ animationDelay: "0.4s" }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input area */}
//           <div className="p-3 border-t border-[#E4B343]/30 bg-gradient-to-r from-[#000000] to-[#000000]">
//             <div className="flex items-center bg-[#0B0B0C] rounded-lg border border-gray-700 overflow-hidden">
//               <input
//                 type="text"
//                 placeholder={
//                   isLoading ? "Loading..." : "Ask about our cars..."
//                 }
//                 className="flex-1 p-3 outline-none text-sm placeholder-gray-400 bg-transparent text-white resize-none"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleKeyPress}
//                 disabled={isLoading || isTyping}
//                 maxLength={500}
//               />
//               <button
//                 onClick={handleSend}
//                 disabled={!input.trim() || isLoading || isTyping}
//                 className={`p-2 px-3 transition-colors ${
//                   input.trim() && !isLoading && !isTyping
//                     ? "text-[#E4B343] hover:text-[#E4B343]/90 cursor-pointer"
//                     : "text-gray-500 cursor-not-allowed"
//                 }`}
//                 title="Send Message"
//               >
//                 <Send
//                   size={18}
//                   color={
//                     input.trim() && !isLoading && !isTyping ? "#E4B343" : "#6b7280"
//                   }
//                 />
//               </button>
//             </div>
//             <div className="text-xs text-gray-400 mt-1 text-center">
//               Browns Autos © {new Date().getFullYear()} | Powered by MotoMate AI
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Custom scrollbar styles */}
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
//           background-color: #e4b343;
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
/////////////////////////////this code for General.flow workflow of mindstudio////////////////////////////////////
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { X, Maximize2, Minimize2, Send, RotateCcw } from "lucide-react";
// import { supabase } from "@/app/lib/supabaseClient";
// import Image from "next/image";

// // Remove direct API constants - now handled by API route

// export default function ChatWidget() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [sessionId, setSessionId] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const messagesEndRef = useRef(null);

//   // Initialize chat on component mount
//   useEffect(() => {
//     const initializeChat = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
        
//         let existingSessionId = null;
//         if (typeof window !== "undefined") {
//           existingSessionId = localStorage.getItem("chatSessionId");
//         }

//         if (existingSessionId) {
//           setSessionId(existingSessionId);
//           await loadExistingMessages(existingSessionId);
//         } else {
//           await createNewSession();
//         }
//       } catch (error) {
//         console.error("Error initializing chat:", error);
//         setError("Failed to initialize chat");
//         // Fallback to local session
//         const fallbackSessionId = `local_${Date.now()}`;
//         setSessionId(fallbackSessionId);
//         if (typeof window !== "undefined") {
//           localStorage.setItem("chatSessionId", fallbackSessionId);
//         }
//         setMessages([getWelcomeMessage()]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeChat();
//   }, []);

//   // Create new session
//   const createNewSession = async () => {
//     try {
//       const { data: session, error: createError } = await supabase
//         .from("chat_sessions")
//         .insert([{ created_at: new Date().toISOString() }])
//         .select("session_id")
//         .single();

//       if (createError) {
//         throw createError;
//       }

//       const newSessionId = session.session_id.toString();
//       setSessionId(newSessionId);
      
//       if (typeof window !== "undefined") {
//         localStorage.setItem("chatSessionId", newSessionId);
//       }

//       const welcomeMessage = getWelcomeMessage();
//       setMessages([welcomeMessage]);
//       await saveMessage(welcomeMessage, newSessionId);
//     } catch (error) {
//       console.error("Error creating new session:", error);
//       throw error;
//     }
//   };

//   // Load existing messages
//   const loadExistingMessages = async (sessionId) => {
//     try {
//       const { data: existingMessages, error } = await supabase
//         .from("chat_messages")
//         .select("*")
//         .eq("session_id", parseInt(sessionId))
//         .order("created_at", { ascending: true });

//       if (error) {
//         console.error("Error loading existing messages:", error);
//         setMessages([getWelcomeMessage()]);
//         return;
//       }

//       if (existingMessages && existingMessages.length > 0) {
//         const formattedMessages = existingMessages.map((msg) => ({
//           id: msg.id,
//           sender: msg.sender,
//           text: msg.message,
//           created_at: msg.created_at,
//         }));
//         setMessages(formattedMessages);
//       } else {
//         const welcomeMessage = getWelcomeMessage();
//         setMessages([welcomeMessage]);
//         await saveMessage(welcomeMessage, sessionId);
//       }
//     } catch (error) {
//       console.error("Error loading messages:", error);
//       setMessages([getWelcomeMessage()]);
//     }
//   };

//   // Get welcome message
//   const getWelcomeMessage = () => ({
//     id: `welcome_${Date.now()}`,
//     sender: "bot",
//     text: "Welcome to Browns Autos! I'm MotoMate, your AI assistant. How can I help you find your perfect car today?",
//     created_at: new Date().toISOString(),
//   });

//   // Scroll to bottom
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     if (messages.length > 0) {
//       scrollToBottom();
//     }
//   }, [messages]);

//   // Save message to database
//   const saveMessage = async (message, sessionIdOverride = null) => {
//     const currentSessionId = sessionIdOverride || sessionId;
//     if (!currentSessionId || currentSessionId.startsWith('local_')) return;

//     try {
//       const { error } = await supabase.from("chat_messages").insert([
//         {
//           session_id: parseInt(currentSessionId),
//           sender: message.sender,
//           message: message.text,
//           created_at: message.created_at || new Date().toISOString(),
//         },
//       ]);

//       if (error) {
//         console.error("Error saving message:", error);
//       }
//     } catch (error) {
//       console.error("Error saving message:", error);
//     }
//   };

//   // Format conversation history for MindStudio
//   const formatConversationHistory = (messages) => {
//     // Get the last 10 messages to avoid token limits, excluding the welcome message
//     const conversationMessages = messages
//       .filter(msg => !msg.id?.includes('welcome_'))
//       .slice(-10);

//     if (conversationMessages.length === 0) {
//       return "";
//     }

//     const historyText = conversationMessages
//       .map(msg => {
//         const role = msg.sender === "user" ? "User" : "AI";
//         return `${role}: ${msg.text}`;
//       })
//       .join("\n");

//     return `Previous conversation:\n${historyText}\n\nCurrent question:`;
//   };

//   // MindStudio API call through Next.js API route with history
//   const fetchMindStudioResponse = async (userInput) => {
//     try {
//       // Format conversation history
//       const conversationHistory = formatConversationHistory(messages);
      
//       const response = await fetch('/api/chat/mindstudio', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_prompt: userInput,
//           history: conversationHistory,
//           session_id: sessionId
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `API request failed with status ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (data?.success && data?.result) {
//         return data.result;
//       } else if (data?.error) {
//         console.error("MindStudio API error:", data.error);
//         return "I'm experiencing some technical difficulties. Please try again.";
//       } else {
//         return "I'm not sure how to answer that. Could you please rephrase your question?";
//       }
//     } catch (error) {
//       console.error("MindStudio API error:", error);
      
//       if (error.name === 'TypeError' && error.message.includes('fetch')) {
//         return "I'm having trouble connecting to my AI service. Please check your internet connection and try again.";
//       } else if (error.message.includes('Failed to fetch')) {
//         return "Network error. Please check your internet connection and try again.";
//       } else if (error.message.includes('401')) {
//         return "Authentication error with AI service. Please contact support.";
//       } else if (error.message.includes('429')) {
//         return "I'm receiving too many requests right now. Please wait a moment and try again.";
//       } else if (error.message.includes('503')) {
//         return "AI service is temporarily unavailable. Please try again in a moment.";
//       } else {
//         return "Oops! Something went wrong while processing your request. Please try again.";
//       }
//     }
//   };

//   // Handle send message
//   const handleSend = async () => {
//     const trimmedInput = input.trim();
//     if (!trimmedInput || isLoading || isTyping) return;

//     const userMessage = {
//       id: `user_${Date.now()}`,
//       sender: "user",
//       text: trimmedInput,
//       created_at: new Date().toISOString(),
//     };

//     // Add user message immediately
//     setMessages(prevMessages => [...prevMessages, userMessage]);
//     setInput("");
//     setIsTyping(true);
//     setError(null);

//     // Save user message
//     if (sessionId) {
//       await saveMessage(userMessage);
//     }

//     try {
//       // Get bot response from MindStudio with conversation history
//       const botResponseText = await fetchMindStudioResponse(trimmedInput);

//       const botMessage = {
//         id: `bot_${Date.now()}`,
//         sender: "bot",
//         text: botResponseText,
//         created_at: new Date().toISOString(),
//       };

//       // Add bot message
//       setMessages(prevMessages => [...prevMessages, botMessage]);

//       // Save bot message
//       if (sessionId) {
//         await saveMessage(botMessage);
//       }
//     } catch (error) {
//       console.error("Error in handleSend:", error);
//       const errorMessage = {
//         id: `error_${Date.now()}`,
//         sender: "bot",
//         text: "I'm sorry, I encountered an error processing your message. Please try again.",
//         created_at: new Date().toISOString(),
//       };
//       setMessages(prevMessages => [...prevMessages, errorMessage]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   // Start new chat
//   const startNewChat = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
      
//       // Clear local storage
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("chatSessionId");
//       }

//       // Create new session
//       await createNewSession();
//     } catch (error) {
//       console.error("Error starting new chat:", error);
//       setError("Failed to start new chat");
      
//       // Fallback to local session
//       const fallbackSessionId = `local_${Date.now()}`;
//       setSessionId(fallbackSessionId);
//       if (typeof window !== "undefined") {
//         localStorage.setItem("chatSessionId", fallbackSessionId);
//       }
//       setMessages([getWelcomeMessage()]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle key press
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div style={{ background: "transparent !important", pointerEvents: "auto" }}>
//       {/* Chat trigger button */}
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="fixed bottom-5 right-5 p-4 flex items-center justify-center cursor-pointer bg-transparent hover:scale-110 transition-transform duration-200"
//           title="Open MotoMate Chat"
//         >
//           <Image
//             className="rounded-full shadow-lg"
//             alt="MotoMate Chat"
//             width={60}
//             height={60}
//             src="/motomate_chat.png"
//           />
//         </button>
//       )}

//       {/* Chat window */}
//       {isOpen && (
//         <div
//           className={`fixed ${
//             isExpanded
//               ? "bottom-0 right-0 h-screen max-w-md w-full"
//               : "bottom-5 right-5 w-80 h-96"
//           } bg-[#000000f3] text-white rounded-lg shadow-2xl flex flex-col font-sans overflow-hidden transition-all duration-300 border border-[#E4B343]/30 z-50`}
//         >
//           {/* Header */}
//           <div className="bg-gradient-to-r from-[#030303] to-[#000000] text-[#E4B343] p-3 flex justify-between items-center border-b border-[#E4B343]/30">
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
//                 <Image
//                   className="bg-transparent"
//                   alt="MotoMate Logo"
//                   width={120}
//                   height={20}
//                   src="/motomatechatlogo.png"
//                 />
//               </div>
//               <div className="text-xs text-[#ffffff]">
//                 {isLoading ? "Loading..." : isTyping ? "Typing..." : "Online"}
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={startNewChat}
//                 disabled={isLoading}
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
//                 title="Start New Chat"
//               >
//                 <RotateCcw size={16} />
//               </button>
//               <button
//                 onClick={() => setIsExpanded(!isExpanded)}
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
//                 title={isExpanded ? "Minimize" : "Expand"}
//               >
//                 {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
//               </button>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
//                 title="Close Chat"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           </div>

//           {/* Messages area */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-opacity-95 scrollbar-gold">
//             {isLoading ? (
//               <div className="flex justify-center items-center h-full">
//                 <div className="text-gray-400">Loading chat history...</div>
//               </div>
//             ) : (
//               <>
//                 {error && (
//                   <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
//                     {error}
//                   </div>
//                 )}
                
//                 {messages.map((msg) => (
//                   <div
//                     key={msg.id || `${msg.sender}_${msg.created_at}`}
//                     className={`flex ${
//                       msg.sender === "bot" ? "justify-start" : "justify-end"
//                     }`}
//                   >
//                     <div
//                       className={`p-3 rounded-lg max-w-[85%] text-sm relative break-words ${
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
//                         <div
//                           className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                           style={{ animationDelay: "0.2s" }}
//                         ></div>
//                         <div
//                           className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                           style={{ animationDelay: "0.4s" }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input area */}
//           <div className="p-3 border-t border-[#E4B343]/30 bg-gradient-to-r from-[#000000] to-[#000000]">
//             <div className="flex items-center bg-[#0B0B0C] rounded-lg border border-gray-700 overflow-hidden">
//               <input
//                 type="text"
//                 placeholder={
//                   isLoading ? "Loading..." : "Ask about our cars..."
//                 }
//                 className="flex-1 p-3 outline-none text-sm placeholder-gray-400 bg-transparent text-white resize-none"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleKeyPress}
//                 disabled={isLoading || isTyping}
//                 maxLength={500}
//               />
//               <button
//                 onClick={handleSend}
//                 disabled={!input.trim() || isLoading || isTyping}
//                 className={`p-2 px-3 transition-colors ${
//                   input.trim() && !isLoading && !isTyping
//                     ? "text-[#E4B343] hover:text-[#E4B343]/90 cursor-pointer"
//                     : "text-gray-500 cursor-not-allowed"
//                 }`}
//                 title="Send Message"
//               >
//                 <Send
//                   size={18}
//                   color={
//                     input.trim() && !isLoading && !isTyping ? "#E4B343" : "#6b7280"
//                   }
//                 />
//               </button>
//             </div>
//             <div className="text-xs text-gray-400 mt-1 text-center">
//               Browns Autos © {new Date().getFullYear()} | Powered by MotoMate AI
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Custom scrollbar styles */}
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
//           background-color: #e4b343;
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
// ///////////////////////////General.flow with menu//////////////////
//  "use client";

// import { useState, useRef, useEffect } from "react";
// import { X, Maximize2, Minimize2, Send, RotateCcw } from "lucide-react";
// import { supabase } from "@/app/lib/supabaseClient";
// import Image from "next/image";

// export default function ChatWidget() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [sessionId, setSessionId] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showFinanceMenu, setShowFinanceMenu] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Finance menu options
//   const financeMenuOptions = [
//     { id: 'finance', text: 'View Finance Options', icon: '💰' },
//     { id: 'part_exchange', text: 'Get a Part Exchange...', icon: '🔄' },
//     { id: 'reserve', text: 'Reserve the Vehicle', icon: '🔒' },
//     { id: 'video', text: 'Watch a Video...', icon: '🎥' },
//     { id: 'contact', text: 'Contact a Team Member', icon: '📞' }
//   ];

//   // Initialize chat on component mount
//   useEffect(() => {
//     const initializeChat = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
        
//         let existingSessionId = null;
//         if (typeof window !== "undefined") {
//           existingSessionId = localStorage.getItem("chatSessionId");
//         }

//         if (existingSessionId) {
//           setSessionId(existingSessionId);
//           await loadExistingMessages(existingSessionId);
//         } else {
//           await createNewSession();
//         }
//       } catch (error) {
//         console.error("Error initializing chat:", error);
//         setError("Failed to initialize chat");
//         // Fallback to local session
//         const fallbackSessionId = `local_${Date.now()}`;
//         setSessionId(fallbackSessionId);
//         if (typeof window !== "undefined") {
//           localStorage.setItem("chatSessionId", fallbackSessionId);
//         }
//         setMessages([getWelcomeMessage()]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeChat();
//   }, []);

//   // Create new session
//   const createNewSession = async () => {
//     try {
//       const { data: session, error: createError } = await supabase
//         .from("chat_sessions")
//         .insert([{ created_at: new Date().toISOString() }])
//         .select("session_id")
//         .single();

//       if (createError) {
//         throw createError;
//       }

//       const newSessionId = session.session_id.toString();
//       setSessionId(newSessionId);
      
//       if (typeof window !== "undefined") {
//         localStorage.setItem("chatSessionId", newSessionId);
//       }

//       const welcomeMessage = getWelcomeMessage();
//       setMessages([welcomeMessage]);
//       await saveMessage(welcomeMessage, newSessionId);
//     } catch (error) {
//       console.error("Error creating new session:", error);
//       throw error;
//     }
//   };

//   // Load existing messages
//   const loadExistingMessages = async (sessionId) => {
//     try {
//       const { data: existingMessages, error } = await supabase
//         .from("chat_messages")
//         .select("*")
//         .eq("session_id", parseInt(sessionId))
//         .order("created_at", { ascending: true });

//       if (error) {
//         console.error("Error loading existing messages:", error);
//         setMessages([getWelcomeMessage()]);
//         return;
//       }

//       if (existingMessages && existingMessages.length > 0) {
//         const formattedMessages = existingMessages.map((msg) => ({
//           id: msg.id,
//           sender: msg.sender,
//           text: msg.message,
//           showMenu: msg.show_menu || false, // Handle case where column might not exist
//           created_at: msg.created_at,
//         }));
//         setMessages(formattedMessages);
//       } else {
//         const welcomeMessage = getWelcomeMessage();
//         setMessages([welcomeMessage]);
//         await saveMessage(welcomeMessage, sessionId);
//       }
//     } catch (error) {
//       console.error("Error loading messages:", error);
//       setMessages([getWelcomeMessage()]);
//     }
//   };

//   // Get welcome message
//   const getWelcomeMessage = () => ({
//     id: `welcome_${Date.now()}`,
//     sender: "bot",
//     text: "Welcome to Browns Autos! I'm MotoMate, your AI assistant. How can I help you find your perfect car today?",
//     showMenu: false,
//     created_at: new Date().toISOString(),
//   });

//   // Scroll to bottom
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     if (messages.length > 0) {
//       scrollToBottom();
//     }
//   }, [messages]);

//   // Save message to database
//   const saveMessage = async (message, sessionIdOverride = null) => {
//     const currentSessionId = sessionIdOverride || sessionId;
//     if (!currentSessionId || currentSessionId.startsWith('local_')) return;

//     try {
//       // Prepare the message data without show_menu first (for backward compatibility)
//       const messageData = {
//         session_id: parseInt(currentSessionId),
//         sender: message.sender,
//         message: message.text,
//         created_at: message.created_at || new Date().toISOString(),
//       };

//       // Try to add show_menu field, but handle if column doesn't exist
//       try {
//         messageData.show_menu = message.showMenu || false;
//       } catch (columnError) {
//         // Column doesn't exist, continue without it
//         console.log("show_menu column not available, saving without it");
//       }

//       const { error } = await supabase.from("chat_messages").insert([messageData]);

//       if (error) {
//         // If error is about show_menu column, try again without it
//         if (error.message && error.message.includes('show_menu')) {
//           console.log("Retrying without show_menu column");
//           delete messageData.show_menu;
//           const { error: retryError } = await supabase.from("chat_messages").insert([messageData]);
//           if (retryError) {
//             console.error("Error saving message on retry:", retryError);
//           }
//         } else {
//           console.error("Error saving message:", error);
//         }
//       }
//     } catch (error) {
//       console.error("Error saving message:", error);
//     }
//   };

//   // Format conversation history for MindStudio
//   const formatConversationHistory = (messages) => {
//     // Get the last 10 messages to avoid token limits, excluding the welcome message
//     const conversationMessages = messages
//       .filter(msg => !msg.id?.includes('welcome_'))
//       .slice(-10);

//     if (conversationMessages.length === 0) {
//       return "";
//     }

//     const historyText = conversationMessages
//       .map(msg => {
//         const role = msg.sender === "user" ? "User" : "AI";
//         return `${role}: ${msg.text}`;
//       })
//       .join("\n");

//     return `Previous conversation:\n${historyText}\n\nCurrent question:`;
//   };

//   // MindStudio API call through Next.js API route with history
//   const fetchMindStudioResponse = async (userInput) => {
//     try {
//       // Format conversation history
//       const conversationHistory = formatConversationHistory(messages);
      
//       const response = await fetch('/api/chat/mindstudio', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_prompt: userInput,
//           history: conversationHistory,
//           session_id: sessionId
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `API request failed with status ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (data?.success && data?.result) {
//         return {
//           text: data.result,
//           showMenu: data.showMenu || false
//         };
//       } else if (data?.error) {
//         console.error("MindStudio API error:", data.error);
//         return {
//           text: "I'm experiencing some technical difficulties. Please try again.",
//           showMenu: false
//         };
//       } else {
//         return {
//           text: "I'm not sure how to answer that. Could you please rephrase your question?",
//           showMenu: false
//         };
//       }
//     } catch (error) {
//       console.error("MindStudio API error:", error);
      
//       if (error.name === 'TypeError' && error.message.includes('fetch')) {
//         return {
//           text: "I'm having trouble connecting to my AI service. Please check your internet connection and try again.",
//           showMenu: false
//         };
//       } else if (error.message.includes('Failed to fetch')) {
//         return {
//           text: "Network error. Please check your internet connection and try again.",
//           showMenu: false
//         };
//       } else if (error.message.includes('401')) {
//         return {
//           text: "Authentication error with AI service. Please contact support.",
//           showMenu: false
//         };
//       } else if (error.message.includes('429')) {
//         return {
//           text: "I'm receiving too many requests right now. Please wait a moment and try again.",
//           showMenu: false
//         };
//       } else if (error.message.includes('503')) {
//         return {
//           text: "AI service is temporarily unavailable. Please try again in a moment.",
//           showMenu: false
//         };
//       } else {
//         return {
//           text: "Oops! Something went wrong while processing your request. Please try again.",
//           showMenu: false
//         };
//       }
//     }
//   };

//   // Handle finance menu option click
//   const handleMenuOptionClick = async (option) => {
//     setShowFinanceMenu(false);
    
//     const userMessage = {
//       id: `user_${Date.now()}`,
//       sender: "user",
//       text: option.text,
//       showMenu: false,
//       created_at: new Date().toISOString(),
//     };

//     // Add user message immediately
//     setMessages(prevMessages => [...prevMessages, userMessage]);
//     setIsTyping(true);
//     setError(null);

//     // Save user message
//     if (sessionId) {
//       await saveMessage(userMessage);
//     }

//     try {
//       // Get bot response from MindStudio
//       const response = await fetchMindStudioResponse(option.text);

//       const botMessage = {
//         id: `bot_${Date.now()}`,
//         sender: "bot",
//         text: response.text,
//         showMenu: response.showMenu,
//         created_at: new Date().toISOString(),
//       };

//       // Add bot message
//       setMessages(prevMessages => [...prevMessages, botMessage]);

//       // Show menu if needed
//       if (response.showMenu) {
//         setShowFinanceMenu(true);
//       }

//       // Save bot message
//       if (sessionId) {
//         await saveMessage(botMessage);
//       }
//     } catch (error) {
//       console.error("Error in handleMenuOptionClick:", error);
//       const errorMessage = {
//         id: `error_${Date.now()}`,
//         sender: "bot",
//         text: "I'm sorry, I encountered an error processing your selection. Please try again.",
//         showMenu: false,
//         created_at: new Date().toISOString(),
//       };
//       setMessages(prevMessages => [...prevMessages, errorMessage]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   // Handle send message
//   const handleSend = async () => {
//     const trimmedInput = input.trim();
//     if (!trimmedInput || isLoading || isTyping) return;

//     // Hide finance menu when user sends a new message
//     setShowFinanceMenu(false);

//     const userMessage = {
//       id: `user_${Date.now()}`,
//       sender: "user",
//       text: trimmedInput,
//       showMenu: false,
//       created_at: new Date().toISOString(),
//     };

//     // Add user message immediately
//     setMessages(prevMessages => [...prevMessages, userMessage]);
//     setInput("");
//     setIsTyping(true);
//     setError(null);

//     // Save user message
//     if (sessionId) {
//       await saveMessage(userMessage);
//     }

//     try {
//       // Get bot response from MindStudio with conversation history
//       const response = await fetchMindStudioResponse(trimmedInput);

//       const botMessage = {
//         id: `bot_${Date.now()}`,
//         sender: "bot",
//         text: response.text,
//         showMenu: response.showMenu,
//         created_at: new Date().toISOString(),
//       };

//       // Add bot message
//       setMessages(prevMessages => [...prevMessages, botMessage]);

//       // Show menu if needed
//       if (response.showMenu) {
//         setShowFinanceMenu(true);
//       }

//       // Save bot message
//       if (sessionId) {
//         await saveMessage(botMessage);
//       }
//     } catch (error) {
//       console.error("Error in handleSend:", error);
//       const errorMessage = {
//         id: `error_${Date.now()}`,
//         sender: "bot",
//         text: "I'm sorry, I encountered an error processing your message. Please try again.",
//         showMenu: false,
//         created_at: new Date().toISOString(),
//       };
//       setMessages(prevMessages => [...prevMessages, errorMessage]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   // Start new chat
//   const startNewChat = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       setShowFinanceMenu(false);
      
//       // Clear local storage
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("chatSessionId");
//       }

//       // Create new session
//       await createNewSession();
//     } catch (error) {
//       console.error("Error starting new chat:", error);
//       setError("Failed to start new chat");
      
//       // Fallback to local session
//       const fallbackSessionId = `local_${Date.now()}`;
//       setSessionId(fallbackSessionId);
//       if (typeof window !== "undefined") {
//         localStorage.setItem("chatSessionId", fallbackSessionId);
//       }
//       setMessages([getWelcomeMessage()]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle key press
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div style={{ background: "transparent !important", pointerEvents: "auto" }}>
//       {/* Chat trigger button */}
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="fixed bottom-5 right-5 p-4 flex items-center justify-center cursor-pointer bg-transparent hover:scale-110 transition-transform duration-200"
//           title="Open MotoMate Chat"
//         >
//           <Image
//             className="rounded-full shadow-lg"
//             alt="MotoMate Chat"
//             width={60}
//             height={60}
//             src="/motomate_chat.png"
//           />
//         </button>
//       )}

//       {/* Chat window */}
//       {isOpen && (
//         <div
//           className={`fixed ${
//             isExpanded
//               ? "bottom-0 right-0 h-screen max-w-md"
//               : "bottom-5 right-5 w-80 h-96"
//           } bg-[#000000f3] text-white rounded-lg shadow-2xl flex flex-col font-sans overflow-hidden transition-all duration-300 border border-[#E4B343]/30 z-50`}
//         >
//           {/* Header */}
//           <div className="bg-gradient-to-r from-[#030303] to-[#000000] text-[#E4B343] p-3 flex justify-between items-center border-b border-[#E4B343]/30">
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
//                 <Image
//                   className="bg-transparent"
//                   alt="MotoMate Logo"
//                   width={120}
//                   height={20}
//                   src="/motomatechatlogo.png"
//                 />
//               </div>
//               <div className="text-xs text-[#ffffff]">
//                 {isLoading ? "Loading..." : isTyping ? "Typing..." : "Online"}
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={startNewChat}
//                 disabled={isLoading}
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
//                 title="Start New Chat"
//               >
//                 <RotateCcw size={16} />
//               </button>
//               <button
//                 onClick={() => setIsExpanded(!isExpanded)}
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
//                 title={isExpanded ? "Minimize" : "Expand"}
//               >
//                 {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
//               </button>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
//                 title="Close Chat"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           </div>

//           {/* Messages area */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-opacity-95 scrollbar-gold">
//             {isLoading ? (
//               <div className="flex justify-center items-center h-full">
//                 <div className="text-gray-400">Loading chat history...</div>
//               </div>
//             ) : (
//               <>
//                 {error && (
//                   <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
//                     {error}
//                   </div>
//                 )}
                
//                 {messages.map((msg) => (
//                   <div
//                     key={msg.id || `${msg.sender}_${msg.created_at}`}
//                     className={`flex ${
//                       msg.sender === "bot" ? "justify-start" : "justify-end"
//                     }`}
//                   >
//                     <div
//                       className={`p-3 rounded-lg max-w-[85%] text-sm relative break-words ${
//                         msg.sender === "bot"
//                           ? "bg-[#000000] text-gray-100 rounded-tl-none border border-[#E4B343]"
//                           : "bg-[#E4B343] text-black rounded-tr-none"
//                       }`}
//                     >
//                       {msg.text}
//                     </div>
//                   </div>
//                 ))}

//                 {/* Finance Menu */}
//                 {showFinanceMenu && (
//                   <div className="flex justify-start">
//                     <div className="bg-[#1a1a1a] border border-[#E4B343]/50 rounded-lg p-2 max-w-[85%] shadow-xl">
//                       <div className="text-xs text-[#E4B343] mb-2 font-medium">Quick Actions:</div>
//                       <div className="space-y-1">
//                         {financeMenuOptions.map((option) => (
//                           <button
//                             key={option.id}
//                             onClick={() => handleMenuOptionClick(option)}
//                             className="w-full text-left p-2 text-xs text-white hover:bg-[#E4B343]/10 rounded transition-colors flex items-center gap-2 hover:text-[#E4B343]"
//                           >
//                             <span className="text-base">{option.icon}</span>
//                             <span>{option.text}</span>
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 {isTyping && (
//                   <div className="flex justify-start">
//                     <div className="p-3 rounded-lg max-w-[85%] text-sm bg-[#1F2937] text-gray-100 rounded-tl-none border border-gray-700 relative">
//                       <div className="flex space-x-1">
//                         <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
//                         <div
//                           className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                           style={{ animationDelay: "0.2s" }}
//                         ></div>
//                         <div
//                           className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                           style={{ animationDelay: "0.4s" }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input area */}
//           <div className="p-3 border-t border-[#E4B343]/30 bg-gradient-to-r from-[#000000] to-[#000000]">
//             <div className="flex items-center bg-[#0B0B0C] rounded-lg border border-gray-700 overflow-hidden">
//               <input
//                 type="text"
//                 placeholder={
//                   isLoading ? "Loading..." : "Ask about our cars..."
//                 }
//                 className="flex-1 p-3 outline-none text-sm placeholder-gray-400 bg-transparent text-white resize-none"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleKeyPress}
//                 disabled={isLoading || isTyping}
//                 maxLength={500}
//               />
//               <button
//                 onClick={handleSend}
//                 disabled={!input.trim() || isLoading || isTyping}
//                 className={`p-2 px-3 transition-colors ${
//                   input.trim() && !isLoading && !isTyping
//                     ? "text-[#E4B343] hover:text-[#E4B343]/90 cursor-pointer"
//                     : "text-gray-500 cursor-not-allowed"
//                 }`}
//                 title="Send Message"
//               >
//                 <Send
//                   size={18}
//                   color={
//                     input.trim() && !isLoading && !isTyping ? "#E4B343" : "#6b7280"
//                   }
//                 />
//               </button>
//             </div>
//             <div className="text-xs text-gray-400 mt-1 text-center">
//               Browns Autos © {new Date().getFullYear()} | Powered by MotoMate AI
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Custom scrollbar styles */}
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
//           background-color: #e4b343;
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
// ///////////////////////////General.flow with menu input disabled//////////////////
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { X, Maximize2, Minimize2, Send, RotateCcw } from "lucide-react";
// import { supabase } from "@/app/lib/supabaseClient";
// import Image from "next/image";

// export default function ChatWidget() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [sessionId, setSessionId] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showFinanceMenu, setShowFinanceMenu] = useState(false);
//   const [selectedMenuOption, setSelectedMenuOption] = useState(null);
//   const messagesEndRef = useRef(null);

//   // Finance menu options
//   const financeMenuOptions = [
//     { id: 'finance', text: 'View Finance Options', icon: '💰' },
//     { id: 'part_exchange', text: 'Get a Part Exchange...', icon: '🔄' },
//     { id: 'reserve', text: 'Reserve the Vehicle', icon: '🔒' },
//     { id: 'video', text: 'Watch a Video...', icon: '🎥' },
//     { id: 'contact', text: 'Contact a Team Member', icon: '📞' }
//   ];

//   // Initialize chat on component mount
//   useEffect(() => {
//     const initializeChat = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
        
//         // Load selected menu option from localStorage
//         if (typeof window !== "undefined") {
//           const storedMenuOption = localStorage.getItem("selectedMenuOption");
//           if (storedMenuOption) {
//             try {
//               setSelectedMenuOption(JSON.parse(storedMenuOption));
//             } catch (e) {
//               console.error("Error parsing stored menu option:", e);
//               localStorage.removeItem("selectedMenuOption");
//             }
//           }
//         }
        
//         let existingSessionId = null;
//         if (typeof window !== "undefined") {
//           existingSessionId = localStorage.getItem("chatSessionId");
//         }

//         if (existingSessionId) {
//           setSessionId(existingSessionId);
//           await loadExistingMessages(existingSessionId);
//         } else {
//           await createNewSession();
//         }
//       } catch (error) {
//         console.error("Error initializing chat:", error);
//         setError("Failed to initialize chat");
//         // Fallback to local session
//         const fallbackSessionId = `local_${Date.now()}`;
//         setSessionId(fallbackSessionId);
//         if (typeof window !== "undefined") {
//           localStorage.setItem("chatSessionId", fallbackSessionId);
//         }
//         setMessages([getWelcomeMessage()]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeChat();
//   }, []);

//   // Check if input should be disabled
//   const isInputDisabled = () => {
//     // Disable if loading, typing, or menu is showing and no option has been selected
//     return isLoading || isTyping || (showFinanceMenu && !selectedMenuOption);
//   };

//   // Create new session
//   const createNewSession = async () => {
//     try {
//       const { data: session, error: createError } = await supabase
//         .from("chat_sessions")
//         .insert([{ created_at: new Date().toISOString() }])
//         .select("session_id")
//         .single();

//       if (createError) {
//         throw createError;
//       }

//       const newSessionId = session.session_id.toString();
//       setSessionId(newSessionId);
      
//       if (typeof window !== "undefined") {
//         localStorage.setItem("chatSessionId", newSessionId);
//       }

//       const welcomeMessage = getWelcomeMessage();
//       setMessages([welcomeMessage]);
//       await saveMessage(welcomeMessage, newSessionId);
//     } catch (error) {
//       console.error("Error creating new session:", error);
//       throw error;
//     }
//   };

//   // Load existing messages
//   const loadExistingMessages = async (sessionId) => {
//     try {
//       const { data: existingMessages, error } = await supabase
//         .from("chat_messages")
//         .select("*")
//         .eq("session_id", parseInt(sessionId))
//         .order("created_at", { ascending: true });

//       if (error) {
//         console.error("Error loading existing messages:", error);
//         setMessages([getWelcomeMessage()]);
//         return;
//       }

//       if (existingMessages && existingMessages.length > 0) {
//         const formattedMessages = existingMessages.map((msg) => ({
//           id: msg.id,
//           sender: msg.sender,
//           text: msg.message,
//           showMenu: msg.show_menu || false,
//           created_at: msg.created_at,
//         }));
//         setMessages(formattedMessages);
//       } else {
//         const welcomeMessage = getWelcomeMessage();
//         setMessages([welcomeMessage]);
//         await saveMessage(welcomeMessage, sessionId);
//       }
//     } catch (error) {
//       console.error("Error loading messages:", error);
//       setMessages([getWelcomeMessage()]);
//     }
//   };

//   // Get welcome message
//   const getWelcomeMessage = () => ({
//     id: `welcome_${Date.now()}`,
//     sender: "bot",
//     text: "Welcome to Browns Autos! I'm MotoMate, your AI assistant. How can I help you find your perfect car today?",
//     showMenu: false,
//     created_at: new Date().toISOString(),
//   });

//   // Scroll to bottom
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     if (messages.length > 0) {
//       scrollToBottom();
//     }
//   }, [messages]);

//   // Save message to database
//   const saveMessage = async (message, sessionIdOverride = null) => {
//     const currentSessionId = sessionIdOverride || sessionId;
//     if (!currentSessionId || currentSessionId.startsWith('local_')) return;

//     try {
//       const messageData = {
//         session_id: parseInt(currentSessionId),
//         sender: message.sender,
//         message: message.text,
//         created_at: message.created_at || new Date().toISOString(),
//       };

//       try {
//         messageData.show_menu = message.showMenu || false;
//       } catch (columnError) {
//         console.log("show_menu column not available, saving without it");
//       }

//       const { error } = await supabase.from("chat_messages").insert([messageData]);

//       if (error) {
//         if (error.message && error.message.includes('show_menu')) {
//           console.log("Retrying without show_menu column");
//           delete messageData.show_menu;
//           const { error: retryError } = await supabase.from("chat_messages").insert([messageData]);
//           if (retryError) {
//             console.error("Error saving message on retry:", retryError);
//           }
//         } else {
//           console.error("Error saving message:", error);
//         }
//       }
//     } catch (error) {
//       console.error("Error saving message:", error);
//     }
//   };

//   // Format conversation history for MindStudio
//   const formatConversationHistory = (messages) => {
//     const conversationMessages = messages
//       .filter(msg => !msg.id?.includes('welcome_'))
//       .slice(-10);

//     if (conversationMessages.length === 0) {
//       return "";
//     }

//     const historyText = conversationMessages
//       .map(msg => {
//         const role = msg.sender === "user" ? "User" : "AI";
//         return `${role}: ${msg.text}`;
//       })
//       .join("\n");

//     return `Previous conversation:\n${historyText}\n\nCurrent question:`;
//   };

//   // MindStudio API call through Next.js API route with history
//   const fetchMindStudioResponse = async (userInput) => {
//     try {
//       const conversationHistory = formatConversationHistory(messages);
      
//       const response = await fetch('/api/chat/mindstudio', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_prompt: userInput,
//           history: conversationHistory,
//           session_id: sessionId
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `API request failed with status ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (data?.success && data?.result) {
//         return {
//           text: data.result,
//           showMenu: data.showMenu || false
//         };
//       } else if (data?.error) {
//         console.error("MindStudio API error:", data.error);
//         return {
//           text: "I'm experiencing some technical difficulties. Please try again.",
//           showMenu: false
//         };
//       } else {
//         return {
//           text: "I'm not sure how to answer that. Could you please rephrase your question?",
//           showMenu: false
//         };
//       }
//     } catch (error) {
//       console.error("MindStudio API error:", error);
      
//       if (error.name === 'TypeError' && error.message.includes('fetch')) {
//         return {
//           text: "I'm having trouble connecting to my AI service. Please check your internet connection and try again.",
//           showMenu: false
//         };
//       } else if (error.message.includes('Failed to fetch')) {
//         return {
//           text: "Network error. Please check your internet connection and try again.",
//           showMenu: false
//         };
//       } else if (error.message.includes('401')) {
//         return {
//           text: "Authentication error with AI service. Please contact support.",
//           showMenu: false
//         };
//       } else if (error.message.includes('429')) {
//         return {
//           text: "I'm receiving too many requests right now. Please wait a moment and try again.",
//           showMenu: false
//         };
//       } else if (error.message.includes('503')) {
//         return {
//           text: "AI service is temporarily unavailable. Please try again in a moment.",
//           showMenu: false
//         };
//       } else {
//         return {
//           text: "Oops! Something went wrong while processing your request. Please try again.",
//           showMenu: false
//         };
//       }
//     }
//   };

//   // Handle finance menu option click
//   const handleMenuOptionClick = async (option) => {
//     // Store selected option in localStorage
//     if (typeof window !== "undefined") {
//       localStorage.setItem("selectedMenuOption", JSON.stringify(option));
//     }
//     setSelectedMenuOption(option);
//     setShowFinanceMenu(false);
    
//     const userMessage = {
//       id: `user_${Date.now()}`,
//       sender: "user",
//       text: option.text,
//       showMenu: false,
//       created_at: new Date().toISOString(),
//     };

//     // Add user message immediately
//     setMessages(prevMessages => [...prevMessages, userMessage]);

//     // Save user message
//     if (sessionId) {
//       await saveMessage(userMessage);
//     }

//     // Note: Not calling MindStudio API for menu selections
//     // Input field will be re-enabled since selectedMenuOption is now set
//   };

//   // Handle send message
//   const handleSend = async () => {
//     const trimmedInput = input.trim();
//     if (!trimmedInput || isInputDisabled()) return;

//     // Hide finance menu when user sends a new message
//     setShowFinanceMenu(false);
    
//     // Clear selected menu option when sending new message
//     setSelectedMenuOption(null);
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("selectedMenuOption");
//     }

//     const userMessage = {
//       id: `user_${Date.now()}`,
//       sender: "user",
//       text: trimmedInput,
//       showMenu: false,
//       created_at: new Date().toISOString(),
//     };

//     // Add user message immediately
//     setMessages(prevMessages => [...prevMessages, userMessage]);
//     setInput("");
//     setIsTyping(true);
//     setError(null);

//     // Save user message
//     if (sessionId) {
//       await saveMessage(userMessage);
//     }

//     try {
//       // Get bot response from MindStudio with conversation history
//       const response = await fetchMindStudioResponse(trimmedInput);

//       const botMessage = {
//         id: `bot_${Date.now()}`,
//         sender: "bot",
//         text: response.text,
//         showMenu: response.showMenu,
//         created_at: new Date().toISOString(),
//       };

//       // Add bot message
//       setMessages(prevMessages => [...prevMessages, botMessage]);

//       // Show menu if needed
//       if (response.showMenu) {
//         setShowFinanceMenu(true);
//         // Clear selected option when new menu appears
//         setSelectedMenuOption(null);
//         if (typeof window !== "undefined") {
//           localStorage.removeItem("selectedMenuOption");
//         }
//       }

//       // Save bot message
//       if (sessionId) {
//         await saveMessage(botMessage);
//       }
//     } catch (error) {
//       console.error("Error in handleSend:", error);
//       const errorMessage = {
//         id: `error_${Date.now()}`,
//         sender: "bot",
//         text: "I'm sorry, I encountered an error processing your message. Please try again.",
//         showMenu: false,
//         created_at: new Date().toISOString(),
//       };
//       setMessages(prevMessages => [...prevMessages, errorMessage]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   // Start new chat
//   const startNewChat = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       setShowFinanceMenu(false);
      
//       // Clear selected menu option
//       setSelectedMenuOption(null);
      
//       // Clear local storage
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("chatSessionId");
//         localStorage.removeItem("selectedMenuOption");
//       }

//       // Create new session
//       await createNewSession();
//     } catch (error) {
//       console.error("Error starting new chat:", error);
//       setError("Failed to start new chat");
      
//       // Fallback to local session
//       const fallbackSessionId = `local_${Date.now()}`;
//       setSessionId(fallbackSessionId);
//       if (typeof window !== "undefined") {
//         localStorage.setItem("chatSessionId", fallbackSessionId);
//       }
//       setMessages([getWelcomeMessage()]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle key press
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   // Get placeholder text based on state
//   const getPlaceholderText = () => {
//     if (isLoading) return "Loading...";
//     if (isTyping) return "AI is typing...";
//     if (showFinanceMenu && !selectedMenuOption) return "Please select an option from the menu above...";
//     return "Ask about our cars...";
//   };

//   return (
//     <div style={{ background: "transparent !important", pointerEvents: "auto" }}>
//       {/* Chat trigger button */}
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="fixed bottom-5 right-5 p-4 flex items-center justify-center cursor-pointer bg-transparent hover:scale-110 transition-transform duration-200"
//           title="Open MotoMate Chat"
//         >
//           <Image
//             className="rounded-full shadow-lg"
//             alt="MotoMate Chat"
//             width={60}
//             height={60}
//             src="/motomate_chat.png"
//           />
//         </button>
//       )}

//       {/* Chat window */}
//       {isOpen && (
//         <div
//           className={`fixed ${
//             isExpanded
//               ? "bottom-0 right-0 h-screen max-w-md"
//               : "bottom-5 right-5 w-80 h-96"
//           } bg-[#000000f3] text-white rounded-lg shadow-2xl flex flex-col font-sans overflow-hidden transition-all duration-300 border border-[#E4B343]/30 z-50`}
//         >
//           {/* Header */}
//           <div className="bg-gradient-to-r from-[#030303] to-[#000000] text-[#E4B343] p-3 flex justify-between items-center border-b border-[#E4B343]/30">
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
//                 <Image
//                   className="bg-transparent"
//                   alt="MotoMate Logo"
//                   width={120}
//                   height={20}
//                   src="/motomatechatlogo.png"
//                 />
//               </div>
//               <div className="text-xs text-[#ffffff]">
//                 {isLoading ? "Loading..." : isTyping ? "Typing..." : "Online"}
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={startNewChat}
//                 disabled={isLoading}
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
//                 title="Start New Chat"
//               >
//                 <RotateCcw size={16} />
//               </button>
//               <button
//                 onClick={() => setIsExpanded(!isExpanded)}
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
//                 title={isExpanded ? "Minimize" : "Expand"}
//               >
//                 {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
//               </button>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
//                 title="Close Chat"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           </div>

//           {/* Messages area */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-opacity-95 scrollbar-gold">
//             {isLoading ? (
//               <div className="flex justify-center items-center h-full">
//                 <div className="text-gray-400">Loading chat history...</div>
//               </div>
//             ) : (
//               <>
//                 {error && (
//                   <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
//                     {error}
//                   </div>
//                 )}
                
//                 {messages.map((msg) => (
//                   <div
//                     key={msg.id || `${msg.sender}_${msg.created_at}`}
//                     className={`flex ${
//                       msg.sender === "bot" ? "justify-start" : "justify-end"
//                     }`}
//                   >
//                     <div
//                       className={`p-3 rounded-lg max-w-[85%] text-sm relative break-words ${
//                         msg.sender === "bot"
//                           ? "bg-[#000000] text-gray-100 rounded-tl-none border border-[#E4B343]"
//                           : "bg-[#E4B343] text-black rounded-tr-none"
//                       }`}
//                     >
//                       {msg.text}
//                     </div>
//                   </div>
//                 ))}

//                 {/* Finance Menu */}
//                 {showFinanceMenu && (
//                   <div className="flex justify-start">
//                     <div className="bg-[#1a1a1a] border border-[#E4B343]/50 rounded-lg p-2 max-w-[85%] shadow-xl">
//                       <div className="text-xs text-[#E4B343] mb-2 font-medium">Quick Actions:</div>
//                       <div className="space-y-1">
//                         {financeMenuOptions.map((option) => (
//                           <button
//                             key={option.id}
//                             onClick={() => handleMenuOptionClick(option)}
//                             className="w-full text-left p-2 text-xs text-white hover:bg-[#E4B343]/10 rounded transition-colors flex items-center gap-2 hover:text-[#E4B343]"
//                           >
//                             <span className="text-base">{option.icon}</span>
//                             <span>{option.text}</span>
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 {isTyping && (
//                   <div className="flex justify-start">
//                     <div className="p-3 rounded-lg max-w-[85%] text-sm bg-[#1F2937] text-gray-100 rounded-tl-none border border-gray-700 relative">
//                       <div className="flex space-x-1">
//                         <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
//                         <div
//                           className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                           style={{ animationDelay: "0.2s" }}
//                         ></div>
//                         <div
//                           className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                           style={{ animationDelay: "0.4s" }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input area */}
//           <div className="p-3 border-t border-[#E4B343]/30 bg-gradient-to-r from-[#000000] to-[#000000]">
//             <div className="flex items-center bg-[#0B0B0C] rounded-lg border border-gray-700 overflow-hidden">
//               <input
//                 type="text"
//                 placeholder={getPlaceholderText()}
//                 className={`flex-1 p-3 outline-none text-sm placeholder-gray-400 bg-transparent text-white resize-none ${
//                   isInputDisabled() ? 'cursor-not-allowed opacity-50' : ''
//                 }`}
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleKeyPress}
//                 disabled={isInputDisabled()}
//                 maxLength={500}
//               />
//               <button
//                 onClick={handleSend}
//                 disabled={!input.trim() || isInputDisabled()}
//                 className={`p-2 px-3 transition-colors ${
//                   input.trim() && !isInputDisabled()
//                     ? "text-[#E4B343] hover:text-[#E4B343]/90 cursor-pointer"
//                     : "text-gray-500 cursor-not-allowed"
//                 }`}
//                 title="Send Message"
//               >
//                 <Send
//                   size={18}
//                   color={
//                     input.trim() && !isInputDisabled() ? "#E4B343" : "#6b7280"
//                   }
//                 />
//               </button>
//             </div>
            
//             {/* Show menu selection status */}
//             {selectedMenuOption && (
//               <div className="text-xs text-green-400 mt-1 text-center">
//                 Selected: {selectedMenuOption.text}
//               </div>
//             )}
            
//             <div className="text-xs text-gray-400 mt-1 text-center">
//               Browns Autos © {new Date().getFullYear()} | Powered by MotoMate AI
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Custom scrollbar styles */}
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
//           background-color: #e4b343;
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
////////////////////////////////general.flow and Details.flow with menu CTA//////////////////////
"use client";

import { useState, useRef, useEffect } from "react";
import { X, Maximize2, Minimize2, Send, RotateCcw } from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";
import Image from "next/image";

// Linkify any URL
const urlRegex = /((https?:\/\/)[^\s<]+[^<.,:;"')\]\s])/gi;
function LinkifiedText({ text }) {
  if (!text) return null;
  const parts = String(text).split(urlRegex);
  return parts.map((part, idx) => {
    if (urlRegex.test(part)) {
      return (
        <a key={`lnk_${idx}`} href={part} target="_blank" rel="noopener noreferrer" className="underline text-[#E4B343] break-words">
          {part}
        </a>
      );
    }
    return <span key={`txt_${idx}`}>{part}</span>;
  });
}

// Guess vehicle display name from bot text like:
// "Got it — you’re interested in BMW Horizon Saloon (2018 – 2022) — £8,567."
function guessVehicleNameFromBotText(t = "") {
  const firstLine = (t || "").split("\n")[0] || "";
  const withoutPrefix = firstLine.replace(/^got it\s*[-—]\s*you[’']?re interested in\s*/i, "").trim();
  // up to the first dash (price) if present
  return (withoutPrefix.split("—")[0] || "").trim();
}

// Normalize fancy dashes and whitespace
function normalizeName(s = "") {
  return s.replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFinanceMenu, setShowFinanceMenu] = useState(false);
  const [selectedMenuOption, setSelectedMenuOption] = useState(null);
  const messagesEndRef = useRef(null);

  const financeMenuOptions = [
    { id: 'finance', text: 'View Finance Options', icon: '💰' },
    { id: 'part_exchange', text: 'Get a Part Exchange...', icon: '🔄' },
    { id: 'reserve', text: 'Reserve the Vehicle', icon: '🔒' },
    { id: 'video', text: 'Watch a Video/Details', icon: '🎥' },
    { id: 'contact', text: 'Contact a Team Member', icon: '📞' }
  ];

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (typeof window !== "undefined") {
          const storedMenuOption = localStorage.getItem("selectedMenuOption");
          if (storedMenuOption) {
            try { setSelectedMenuOption(JSON.parse(storedMenuOption)); }
            catch { localStorage.removeItem("selectedMenuOption"); }
          }
        }

        let existingSessionId = null;
        if (typeof window !== "undefined") {
          existingSessionId = localStorage.getItem("chatSessionId");
        }

        if (existingSessionId) {
          setSessionId(existingSessionId);
          await loadExistingMessages(existingSessionId);
        } else {
          await createNewSession();
        }
      } catch (err) {
        console.error("Error initializing chat:", err);
        setError("Failed to initialize chat");
        const fallbackSessionId = `local_${Date.now()}`;
        setSessionId(fallbackSessionId);
        if (typeof window !== "undefined") localStorage.setItem("chatSessionId", fallbackSessionId);
        setMessages([getWelcomeMessage()]);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const isInputDisabled = () => isLoading || isTyping || (showFinanceMenu && !selectedMenuOption);

  const createNewSession = async () => {
    const { data: session, error: createError } = await supabase
      .from("chat_sessions")
      .insert([{ created_at: new Date().toISOString() }])
      .select("session_id")
      .single();
    if (createError) throw createError;

    const newSessionId = session.session_id.toString();
    setSessionId(newSessionId);
    if (typeof window !== "undefined") localStorage.setItem("chatSessionId", newSessionId);

    const welcomeMessage = getWelcomeMessage();
    setMessages([welcomeMessage]);
    await saveMessage(welcomeMessage, newSessionId);
  };

  const loadExistingMessages = async (sessionId) => {
    try {
      const { data: existingMessages, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", parseInt(sessionId))
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
        setMessages([getWelcomeMessage()]);
        return;
      }

      if (existingMessages?.length) {
        const formatted = existingMessages.map((m) => ({
          id: m.id,
          sender: m.sender,
          text: m.message,
          showMenu: m.show_menu || false,
          created_at: m.created_at,
        }));
        setMessages(formatted);
      } else {
        const welcomeMessage = getWelcomeMessage();
        setMessages([welcomeMessage]);
        await saveMessage(welcomeMessage, sessionId);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([getWelcomeMessage()]);
    }
  };

  const getWelcomeMessage = () => ({
    id: `welcome_${Date.now()}`,
    sender: "bot",
    text: "Welcome to Browns Autos! I'm MotoMate, your AI assistant. How can I help you find your perfect car today?",
    showMenu: false,
    created_at: new Date().toISOString(),
  });

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { if (messages.length) scrollToBottom(); }, [messages]);

  const saveMessage = async (message, sessionIdOverride = null) => {
    const currentSessionId = sessionIdOverride || sessionId;
    if (!currentSessionId || currentSessionId.startsWith('local_')) return;

    try {
      const payload = {
        session_id: parseInt(currentSessionId),
        sender: message.sender,
        message: message.text,
        created_at: message.created_at || new Date().toISOString(),
      };
      try { payload.show_menu = message.showMenu || false; } catch {}
      const { error } = await supabase.from("chat_messages").insert([payload]);
      if (error) {
        if (error.message?.includes('show_menu')) {
          delete payload.show_menu;
          const { error: retryError } = await supabase.from("chat_messages").insert([payload]);
          if (retryError) console.error("Error saving message on retry:", retryError);
        } else {
          console.error("Error saving message:", error);
        }
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const formatConversationHistory = (messages) => {
    const conversation = messages.filter(m => !m.id?.includes('welcome_')).slice(-10);
    if (!conversation.length) return "";
    const historyText = conversation.map(m => `${m.sender === "user" ? "User" : "AI"}: ${m.text}`).join("\n");
    return `Previous conversation:\n${historyText}\n\nCurrent question:`;
  };

  // Stronger Supabase fallback: normalize dashes; try multiple patterns
  const findVehicleIdFromText = async (botText) => {
    try {
      const raw = guessVehicleNameFromBotText(botText);
      if (!raw) return null;

      const name = normalizeName(raw);                           // e.g., "BMW Horizon Saloon (2018 - 2022)"
      const base = name.split("(")[0].trim();                    // e.g., "BMW Horizon Saloon"

      // 1) exact-ish full_name contains
      let { data, error } = await supabase
        .from('vehicles')
        .select('id, full_name')
        .ilike('full_name', `%${name}%`)
        .limit(1);
      if (error) console.warn('Supabase lookup 1 error:', error?.message);

      if (!data?.[0]) {
        // 2) try with just the base model name (no years)
        ({ data, error } = await supabase
          .from('vehicles')
          .select('id, full_name')
          .ilike('full_name', `%${base}%`)
          .limit(1));
        if (error) console.warn('Supabase lookup 2 error:', error?.message);
      }

      if (!data?.[0] && base) {
        // 3) fallback to model column if you keep it populated
        ({ data, error } = await supabase
          .from('vehicles')
          .select('id, full_name')
          .ilike('model', `%${base}%`)
          .limit(1));
        if (error) console.warn('Supabase lookup 3 error:', error?.message);
      }

      return data?.[0]?.id || null;
    } catch (e) {
      console.warn('Supabase lookup failed:', e);
      return null;
    }
  };

  // Call server → MindStudio
  const fetchMindStudioResponse = async (userInput, opts = {}) => {
    const { workflow = 'general', vehicle_id, forceMenuOnEmpty = false } = opts;
    try {
      const conversationHistory = formatConversationHistory(messages);

      const response = await fetch('/api/chat/mindstudio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_prompt: userInput, history: conversationHistory, session_id: sessionId, workflow, vehicle_id }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `API request failed (${response.status})`);
      }

      const data = await response.json();
      const rawText = (data?.success && typeof data?.result !== 'undefined') ? String(data.result) : '';

      if (forceMenuOnEmpty && (!rawText || rawText.trim() === '')) {
        return { text: "", showMenu: true, vehicle_id: data.vehicle_id || null, vehicle_name: data.vehicle_name || null, workflow: data.workflow };
      }

      if (data?.success && typeof data?.result !== 'undefined') {
        return {
          text: rawText,
          showMenu: data.showMenu || false,
          vehicle_id: data.vehicle_id || null,
          vehicle_name: data.vehicle_name || null,
          workflow: data.workflow
        };
      }
      if (data?.error) return { text: "I'm experiencing some technical difficulties. Please try again.", showMenu: false, workflow: data.workflow };
      return { text: "I'm not sure how to answer that. Could you please rephrase your question?", showMenu: false, workflow: data.workflow };
    } catch (error) {
      console.error("MindStudio API error:", error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { text: "I'm having trouble connecting to my AI service. Please check your internet connection and try again.", showMenu: false };
      } else if (error.message.includes('Failed to fetch')) {
        return { text: "Network error. Please check your internet connection and try again.", showMenu: false };
      } else if (error.message.includes('401')) {
        return { text: "Authentication error with AI service. Please contact support.", showMenu: false };
      } else if (error.message.includes('429')) {
        return { text: "I'm receiving too many requests right now. Please wait a moment and try again.", showMenu: false };
      } else if (error.message.includes('503')) {
        return { text: "AI service is temporarily unavailable. Please try again in a moment.", showMenu: false };
      }
      return { text: "Oops! Something went wrong while processing your request. Please try again.", showMenu: false };
    }
  };

  // Menu clicks (Details.flow triggers here)
  const handleMenuOptionClick = async (option) => {
    if (typeof window !== "undefined") localStorage.setItem("selectedMenuOption", JSON.stringify(option));
    setSelectedMenuOption(option);
    setShowFinanceMenu(false);

    const userMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: option.text,
      showMenu: false,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    if (sessionId) await saveMessage(userMessage);

    if (option.id === 'video') {
      let vehicleId = typeof window !== "undefined" ? localStorage.getItem('selectedVehicleId') : null;

      if (!vehicleId) {
        const lastBot = [...messages].reverse().find(m => m.sender === 'bot');
        if (lastBot?.text) {
          vehicleId = await findVehicleIdFromText(lastBot.text);
          if (vehicleId && typeof window !== "undefined") localStorage.setItem('selectedVehicleId', vehicleId);
        }
      }

      if (!vehicleId) {
        const warn = {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text: "I couldn't find the selected vehicle. Please choose a car first, then try “Watch a Video/Details”.",
          showMenu: true,
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, warn]);
        setShowFinanceMenu(true);
        if (sessionId) await saveMessage(warn);
        return;
      }

      setIsTyping(true);

      const response = await fetchMindStudioResponse(
        "Show me the media/details for the selected vehicle.",
        { workflow: 'details', vehicle_id: vehicleId, forceMenuOnEmpty: true }
      );

      // Console diagnostics so you can confirm it hit Details.flow
      console.info('[Details CTA] workflow:', response.workflow, 'vehicle_id:', vehicleId, 'text_length:', (response.text || '').length);

      const textToShow = response.text && response.text.trim() !== '' ? response.text : "Here are some quick actions you can take:";
      const botMessage = {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text: textToShow,
        showMenu: response.showMenu || (response.text?.trim?.() === ''),
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMessage]);

      if (botMessage.showMenu) {
        setShowFinanceMenu(true);
        setSelectedMenuOption(null);
        if (typeof window !== "undefined") localStorage.removeItem("selectedMenuOption");
      }
      if (sessionId) await saveMessage(botMessage);
      setIsTyping(false);
      return;
    }

    // TODO: Finance/Reserve/Contact can call their own flows here
  };

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isInputDisabled()) return;

    setShowFinanceMenu(false);
    setSelectedMenuOption(null);
    if (typeof window !== "undefined") localStorage.removeItem("selectedMenuOption");

    const userMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: trimmedInput,
      showMenu: false,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setError(null);
    if (sessionId) await saveMessage(userMessage);

    const response = await fetchMindStudioResponse(trimmedInput, { workflow: 'general' });

    const botMessage = {
      id: `bot_${Date.now()}`,
      sender: "bot",
      text: response.text,
      showMenu: response.showMenu,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, botMessage]);

    // When General.flow shows the menu, save vehicle_id for later
    if (response.showMenu) {
      if (response.vehicle_id && typeof window !== "undefined") {
        localStorage.setItem('selectedVehicleId', response.vehicle_id);
      } else {
        const fallbackId = await findVehicleIdFromText(response.text);
        if (fallbackId && typeof window !== "undefined") localStorage.setItem('selectedVehicleId', fallbackId);
      }

      setShowFinanceMenu(true);
      setSelectedMenuOption(null);
      if (typeof window !== "undefined") localStorage.removeItem("selectedMenuOption");
    }

    if (sessionId) await saveMessage(botMessage);
    setIsTyping(false);
  };

  const startNewChat = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setShowFinanceMenu(false);
      setSelectedMenuOption(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("chatSessionId");
        localStorage.removeItem("selectedMenuOption");
        // localStorage.removeItem("selectedVehicleId");
      }
      await createNewSession();
    } catch (error) {
      console.error("Error starting new chat:", error);
      setError("Failed to start new chat");
      const fallbackSessionId = `local_${Date.now()}`;
      setSessionId(fallbackSessionId);
      if (typeof window !== "undefined") localStorage.setItem("chatSessionId", fallbackSessionId);
      setMessages([getWelcomeMessage()]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPlaceholderText = () => {
    if (isLoading) return "Loading...";
    if (isTyping) return "AI is typing...";
    if (showFinanceMenu && !selectedMenuOption) return "Please select an option from the menu above...";
    return "Ask about our cars...";
  };

  return (
    <div style={{ background: "transparent !important", pointerEvents: "auto" }}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 p-4 flex items-center justify-center cursor-pointer bg-transparent hover:scale-110 transition-transform duration-200"
          title="Open MotoMate Chat"
        >
          <Image className="rounded-full shadow-lg" alt="MotoMate Chat" width={60} height={60} src="/motomate_chat.png" />
        </button>
      )}

      {isOpen && (
        <div className={`fixed ${isExpanded ? "bottom-0 right-0 h-screen max-w-md" : "bottom-5 right-5 w-80 h-96"} bg-[#000000f3] text-white rounded-lg shadow-2xl flex flex-col font-sans overflow-hidden transition-all duration-300 border border-[#E4B343]/30 z-50`}>
          <div className="bg-gradient-to-r from-[#030303] to-[#000000] text-[#E4B343] p-3 flex justify-between items-center border-b border-[#E4B343]/30">
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
                <Image className="bg-transparent" alt="MotoMate Logo" width={120} height={20} src="/motomatechatlogo.png" />
              </div>
              <div className="text-xs text-[#ffffff]">{isLoading ? "Loading..." : isTyping ? "Typing..." : "Online"}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={startNewChat} disabled={isLoading} className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed" title="Start New Chat">
                <RotateCcw size={16} />
              </button>
              <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors" title={isExpanded ? "Minimize" : "Expand"}>
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors" title="Close Chat">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-opacity-95 scrollbar-gold">
            {isLoading ? (
              <div className="flex justify-center items-center h-full"><div className="text-gray-400">Loading chat history...</div></div>
            ) : (
              <>
                {error && <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">{error}</div>}

                {messages.map((msg) => (
                  <div key={msg.id || `${msg.sender}_${msg.created_at}`} className={`flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}>
                    <div className={`p-3 rounded-lg max-w-[85%] text-sm relative break-words ${msg.sender === "bot" ? "bg-[#000000] text-gray-100 rounded-tl-none border border-[#E4B343]" : "bg-[#E4B343] text-black rounded-tr-none"}`}>
                      <LinkifiedText text={msg.text} />
                    </div>
                  </div>
                ))}

                {showFinanceMenu && (
                  <div className="flex justify-start">
                    <div className="bg-[#1a1a1a] border border-[#E4B343]/50 rounded-lg p-2 max-w-[85%] shadow-xl">
                      <div className="text-xs text-[#E4B343] mb-2 font-medium">Quick Actions:</div>
                      <div className="space-y-1">
                        {financeMenuOptions.map((option) => (
                          <button key={option.id} onClick={() => handleMenuOptionClick(option)} className="w-full text-left p-2 text-xs text-white hover:bg-[#E4B343]/10 rounded transition-colors flex items-center gap-2 hover:text-[#E4B343]">
                            <span className="text-base">{option.icon}</span>
                            <span>{option.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

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

          <div className="p-3 border-t border-[#E4B343]/30 bg-gradient-to-r from-[#000000] to-[#000000]">
            <div className="flex items-center bg-[#0B0B0C] rounded-lg border border-gray-700 overflow-hidden">
              <input
                type="text"
                placeholder={getPlaceholderText()}
                className={`flex-1 p-3 outline-none text-sm placeholder-gray-400 bg-transparent text-white resize-none ${isInputDisabled() ? 'cursor-not-allowed opacity-50' : ''}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isInputDisabled()}
                maxLength={500}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isInputDisabled()}
                className={`p-2 px-3 transition-colors ${input.trim() && !isInputDisabled() ? "text-[#E4B343] hover:text-[#E4B343]/90 cursor-pointer" : "text-gray-500 cursor-not-allowed"}`}
                title="Send Message"
              >
                <Send size={18} color={input.trim() && !isInputDisabled() ? "#E4B343" : "#6b7280"} />
              </button>
            </div>

            {selectedMenuOption && <div className="text-xs text-green-400 mt-1 text-center">Selected: {selectedMenuOption.text}</div>}
            <div className="text-xs text-gray-400 mt-1 text-center">Browns Autos © {new Date().getFullYear()} | Powered by MotoMate AI</div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-gold::-webkit-scrollbar { width: 8px; height: 8px; }
        .scrollbar-gold::-webkit-scrollbar-track { background: #000000; border-radius: 4px; }
        .scrollbar-gold::-webkit-scrollbar-thumb { background-color: #e4b343; border-radius: 4px; border: 2px solid #000000; }
        .scrollbar-gold::-webkit-scrollbar-thumb:hover { background-color: #d1a23c; }
      `}</style>
    </div>
  );
}
