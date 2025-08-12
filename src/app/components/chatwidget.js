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
// /////////////////////////////this code is for perfect integration with mindstudio generated with claude result chat widget integrationm 1///////////////////////
"use client";

import { useState, useRef, useEffect } from "react";
import { X, Maximize2, Minimize2, Send, RotateCcw } from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";
import Image from "next/image";

// Remove direct API constants - now handled by API route

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize chat on component mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
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
      } catch (error) {
        console.error("Error initializing chat:", error);
        setError("Failed to initialize chat");
        // Fallback to local session
        const fallbackSessionId = `local_${Date.now()}`;
        setSessionId(fallbackSessionId);
        if (typeof window !== "undefined") {
          localStorage.setItem("chatSessionId", fallbackSessionId);
        }
        setMessages([getWelcomeMessage()]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, []);

  // Create new session
  const createNewSession = async () => {
    try {
      const { data: session, error: createError } = await supabase
        .from("chat_sessions")
        .insert([{ created_at: new Date().toISOString() }])
        .select("session_id")
        .single();

      if (createError) {
        throw createError;
      }

      const newSessionId = session.session_id.toString();
      setSessionId(newSessionId);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("chatSessionId", newSessionId);
      }

      const welcomeMessage = getWelcomeMessage();
      setMessages([welcomeMessage]);
      await saveMessage(welcomeMessage, newSessionId);
    } catch (error) {
      console.error("Error creating new session:", error);
      throw error;
    }
  };

  // Load existing messages
  const loadExistingMessages = async (sessionId) => {
    try {
      const { data: existingMessages, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", parseInt(sessionId))
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading existing messages:", error);
        setMessages([getWelcomeMessage()]);
        return;
      }

      if (existingMessages && existingMessages.length > 0) {
        const formattedMessages = existingMessages.map((msg) => ({
          id: msg.id,
          sender: msg.sender,
          text: msg.message,
          created_at: msg.created_at,
        }));
        setMessages(formattedMessages);
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

  // Get welcome message
  const getWelcomeMessage = () => ({
    id: `welcome_${Date.now()}`,
    sender: "bot",
    text: "Welcome to Browns Autos! I'm MotoMate, your AI assistant. How can I help you find your perfect car today?",
    created_at: new Date().toISOString(),
  });

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Save message to database
  const saveMessage = async (message, sessionIdOverride = null) => {
    const currentSessionId = sessionIdOverride || sessionId;
    if (!currentSessionId || currentSessionId.startsWith('local_')) return;

    try {
      const { error } = await supabase.from("chat_messages").insert([
        {
          session_id: parseInt(currentSessionId),
          sender: message.sender,
          message: message.text,
          created_at: message.created_at || new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error saving message:", error);
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  // MindStudio API call through Next.js API route
  const fetchMindStudioResponse = async (userInput) => {
    try {
      const response = await fetch('/api/chat/mindstudio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_prompt: userInput
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data?.success && data?.result) {
        return data.result;
      } else if (data?.error) {
        console.error("MindStudio API error:", data.error);
        return "I'm experiencing some technical difficulties. Please try again.";
      } else {
        return "I'm not sure how to answer that. Could you please rephrase your question?";
      }
    } catch (error) {
      console.error("MindStudio API error:", error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return "I'm having trouble connecting to my AI service. Please check your internet connection and try again.";
      } else if (error.message.includes('Failed to fetch')) {
        return "Network error. Please check your internet connection and try again.";
      } else if (error.message.includes('401')) {
        return "Authentication error with AI service. Please contact support.";
      } else if (error.message.includes('429')) {
        return "I'm receiving too many requests right now. Please wait a moment and try again.";
      } else if (error.message.includes('503')) {
        return "AI service is temporarily unavailable. Please try again in a moment.";
      } else {
        return "Oops! Something went wrong while processing your request. Please try again.";
      }
    }
  };

  // Handle send message
  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading || isTyping) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: trimmedInput,
      created_at: new Date().toISOString(),
    };

    // Add user message immediately
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput("");
    setIsTyping(true);
    setError(null);

    // Save user message
    if (sessionId) {
      await saveMessage(userMessage);
    }

    try {
      // Get bot response from MindStudio
      const botResponseText = await fetchMindStudioResponse(trimmedInput);

      const botMessage = {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text: botResponseText,
        created_at: new Date().toISOString(),
      };

      // Add bot message
      setMessages(prevMessages => [...prevMessages, botMessage]);

      // Save bot message
      if (sessionId) {
        await saveMessage(botMessage);
      }
    } catch (error) {
      console.error("Error in handleSend:", error);
      const errorMessage = {
        id: `error_${Date.now()}`,
        sender: "bot",
        text: "I'm sorry, I encountered an error processing your message. Please try again.",
        created_at: new Date().toISOString(),
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Start new chat
  const startNewChat = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Clear local storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("chatSessionId");
      }

      // Create new session
      await createNewSession();
    } catch (error) {
      console.error("Error starting new chat:", error);
      setError("Failed to start new chat");
      
      // Fallback to local session
      const fallbackSessionId = `local_${Date.now()}`;
      setSessionId(fallbackSessionId);
      if (typeof window !== "undefined") {
        localStorage.setItem("chatSessionId", fallbackSessionId);
      }
      setMessages([getWelcomeMessage()]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ background: "transparent !important", pointerEvents: "auto" }}>
      {/* Chat trigger button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 p-4 flex items-center justify-center cursor-pointer bg-transparent hover:scale-110 transition-transform duration-200"
          title="Open MotoMate Chat"
        >
          <Image
            className="rounded-full shadow-lg"
            alt="MotoMate Chat"
            width={60}
            height={60}
            src="/motomate_chat.png"
          />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className={`fixed ${
            isExpanded
              ? "bottom-0 right-0 h-screen max-w-md w-full"
              : "bottom-5 right-5 w-80 h-96"
          } bg-[#000000f3] text-white rounded-lg shadow-2xl flex flex-col font-sans overflow-hidden transition-all duration-300 border border-[#E4B343]/30 z-50`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#030303] to-[#000000] text-[#E4B343] p-3 flex justify-between items-center border-b border-[#E4B343]/30">
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
                <Image
                  className="bg-transparent"
                  alt="MotoMate Logo"
                  width={120}
                  height={20}
                  src="/motomatechatlogo.png"
                />
              </div>
              <div className="text-xs text-[#ffffff]">
                {isLoading ? "Loading..." : isTyping ? "Typing..." : "Online"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={startNewChat}
                disabled={isLoading}
                className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                title="Start New Chat"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[#E4B343]/10 rounded hover:text-[#E4B343]/90 transition-colors"
                title="Close Chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-opacity-95 scrollbar-gold">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-400">Loading chat history...</div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
                    {error}
                  </div>
                )}
                
                {messages.map((msg) => (
                  <div
                    key={msg.id || `${msg.sender}_${msg.created_at}`}
                    className={`flex ${
                      msg.sender === "bot" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-[85%] text-sm relative break-words ${
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
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-3 border-t border-[#E4B343]/30 bg-gradient-to-r from-[#000000] to-[#000000]">
            <div className="flex items-center bg-[#0B0B0C] rounded-lg border border-gray-700 overflow-hidden">
              <input
                type="text"
                placeholder={
                  isLoading ? "Loading..." : "Ask about our cars..."
                }
                className="flex-1 p-3 outline-none text-sm placeholder-gray-400 bg-transparent text-white resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading || isTyping}
                maxLength={500}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || isTyping}
                className={`p-2 px-3 transition-colors ${
                  input.trim() && !isLoading && !isTyping
                    ? "text-[#E4B343] hover:text-[#E4B343]/90 cursor-pointer"
                    : "text-gray-500 cursor-not-allowed"
                }`}
                title="Send Message"
              >
                <Send
                  size={18}
                  color={
                    input.trim() && !isLoading && !isTyping ? "#E4B343" : "#6b7280"
                  }
                />
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-1 text-center">
              Browns Autos © {new Date().getFullYear()} | Powered by MotoMate AI
            </div>
          </div>
        </div>
      )}

      {/* Custom scrollbar styles */}
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
          background-color: #e4b343;
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
