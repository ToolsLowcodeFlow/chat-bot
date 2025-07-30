"use client";

import { useState, useRef, useEffect } from "react";
import { X, MessageSquare, Maximize2, Minimize2, Send } from "lucide-react";
import { Bot } from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize chat session
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Create a new session in the database
        const { data: sessions, error: createError } = await supabase
          .from('chat_sessions')
          .insert([{}])
          .select('session_id');

        if (createError) {
          console.error('Error creating session:', createError);
          return;
        }

        // Get the new session_id and store it
        const newSessionId = sessions[0].session_id;
        setSessionId(newSessionId);

        // Start with welcome message
        setMessages([getWelcomeMessage()]);
      } catch (error) {
        console.error('Error initializing chat:', error);
        // Fallback to just showing welcome message without session
        setMessages([getWelcomeMessage()]);
      }
    };

    initializeChat();
  }, []);

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

  const saveMessage = async (message) => {
    if (!sessionId) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          session_id: sessionId,
          sender: message.sender,
          message: message.text,
          created_at: new Date().toISOString()
        }]);
        
      if (error) console.error('Error saving message:', error);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Create user message object
    const userMessage = { sender: "user", text: input };
    
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
        text: botResponseText
      };
      
      // Add bot response to state and save to DB
      setMessages([...newMessages, botMessage]);
      
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

  return (
    <div style={{ background: 'transparent !important', pointerEvents: 'auto' }}>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 bg-[#E4B343] text-black p-4 rounded-full shadow-lg hover:bg-[#d1a23c] transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center"
        >
          <MessageSquare size={24} />
        </button>
      )}
      
      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed ${isExpanded ? "bottom-0 right-0 w-full h-screen max-w-md" : "bottom-5 right-5 w-80 h-96"} bg-[#000000f3] text-white rounded-lg shadow-2xl flex flex-col font-sans overflow-hidden transition-all duration-300 border border-[#E4B343]/30`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-[#030303] to-[#000000] text-[#E4B343] p-3 flex justify-between items-center border-b border-[#E4B343]/30">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bot size={20} className="text-[#E4B343]"/>
                <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <div>
                <div className="font-bold">MotoMate</div>
                <div className="text-xs text-gray-300">
                  {isTyping ? "Typing..." : "Online"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-3 border-t border-[#E4B343]/30 bg-gradient-to-r from-[#000000] to-[#000000]">
            <div className="flex items-center bg-[#0B0B0C] rounded-lg border border-gray-700 overflow-hidden">
              <input
                type="text"
                placeholder="Ask about our cars..."
                className="flex-1 p-3 outline-none text-sm placeholder-gray-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-2 px-3 ${input.trim() ? "text-[#E4B343] hover:text-[#E4B343]/90" : "text-gray-500"}`}
              >
                <Send size={18} color="#ecd6a3" />
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