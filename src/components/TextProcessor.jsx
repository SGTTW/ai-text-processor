// import React, { useState, useRef, useEffect } from 'react';
// import { Send, Loader2 } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';

// // Types for our messages and API responses
// interface Message = {
//   id: string;
//   text: string;
//   detectedLanguage?: string;
//   summary?: string;
//   translation?: string;
//   timestamp: Date;
// };

// interface  Language = {
//   code: string;
//   name: string;
// };

// const TextProcessor = () => {
//   // Available languages for translation
//   const languages: Language[] = [
//     { code: 'en', name: 'English' },
//     { code: 'pt', name: 'Portuguese' },
//     { code: 'es', name: 'Spanish' },
//     { code: 'ru', name: 'Russian' },
//     { code: 'tr', name: 'Turkish' },
//     { code: 'fr', name: 'French' },
//   ];

//   // State management
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputText, setInputText] = useState('');
//   const [selectedLanguage, setSelectedLanguage] = useState('en');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Refs
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   // Auto-scroll to bottom when new messages are added
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Mock API calls (replace with actual Chrome AI API implementations)
//   const detectLanguage = async (text: string): Promise<string> => {
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 500));
//     return 'en'; // Mock response
//   };

//   const summarizeText = async (text: string): Promise<string> => {
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     return `Summary of: ${text.substring(0, 50)}...`;
//   };

//   const translateText = async (text: string, targetLang: string): Promise<string> => {
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 800));
//     return `Translated to ${targetLang}: ${text.substring(0, 30)}...`;
//   };

//   // Handler functions
//   const handleSend = async () => {
//     if (!inputText.trim()) {
//       setError('Please enter some text');
//       return;
//     }

//     setIsProcessing(true);
//     setError(null);

//     try {
//       const detectedLang = await detectLanguage(inputText);

//       const newMessage: Message = {
//         id: Date.now().toString(),
//         text: inputText,
//         detectedLanguage: detectedLang,
//         timestamp: new Date(),
//       };

//       setMessages(prev => [...prev, newMessage]);
//       setInputText('');

//       if (textareaRef.current) {
//         textareaRef.current.focus();
//       }
//     } catch (err) {
//       setError('Failed to process text. Please try again.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleSummarize = async (messageId: string) => {
//     setIsProcessing(true);
//     setError(null);

//     try {
//       const message = messages.find(m => m.id === messageId);
//       if (!message) return;

//       const summary = await summarizeText(message.text);

//       setMessages(prev => prev.map(m =>
//         m.id === messageId ? { ...m, summary } : m
//       ));
//     } catch (err) {
//       setError('Failed to summarize text. Please try again.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleTranslate = async (messageId: string) => {
//     setIsProcessing(true);
//     setError(null);

//     try {
//       const message = messages.find(m => m.id === messageId);
//       if (!message) return;

//       const translation = await translateText(message.text, selectedLanguage);

//       setMessages(prev => prev.map(m =>
//         m.id === messageId ? { ...m, translation } : m
//       ));
//     } catch (err) {
//       setError('Failed to translate text. Please try again.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto mb-4 space-y-4">
//         {messages.map((message) => (
//           <div key={message.id} className="bg-white rounded-lg shadow p-4">
//             <p className="text-gray-800 mb-2">{message.text}</p>

//             {message.detectedLanguage && (
//               <p className="text-sm text-gray-500 mb-2">
//                 Language: {message.detectedLanguage}
//               </p>
//             )}

//             <div className="flex flex-wrap gap-2 mb-2">
//               {message.text.length > 150 && message.detectedLanguage === 'en' && !message.summary && (
//                 <button
//                   onClick={() => handleSummarize(message.id)}
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                   aria-label="Summarize text"
//                 >
//                   Summarize
//                 </button>
//               )}

//               <select
//                 value={selectedLanguage}
//                 onChange={(e) => setSelectedLanguage(e.target.value)}
//                 className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 aria-label="Select target language"
//               >
//                 {languages.map((lang) => (
//                   <option key={lang.code} value={lang.code}>
//                     {lang.name}
//                   </option>
//                 ))}
//               </select>

//               <button
//                 onClick={() => handleTranslate(message.id)}
//                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//                 aria-label="Translate text"
//               >
//                 Translate
//               </button>
//             </div>

//             {message.summary && (
//               <div className="bg-blue-50 p-3 rounded mt-2">
//                 <p className="text-sm font-medium text-blue-800">Summary:</p>
//                 <p className="text-sm text-blue-700">{message.summary}</p>
//               </div>
//             )}

//             {message.translation && (
//               <div className="bg-green-50 p-3 rounded mt-2">
//                 <p className="text-sm font-medium text-green-800">Translation:</p>
//                 <p className="text-sm text-green-700">{message.translation}</p>
//               </div>
//             )}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Error Alert */}
//       {error && (
//         <Alert variant="destructive" className="mb-4">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {/* Input Area */}
//       <div className="flex gap-2 items-end">
//         <textarea
//           ref={textareaRef}
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//           className="flex-1 min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Type your message here..."
//           aria-label="Input text"
//         />

//         <button
//           onClick={handleSend}
//           disabled={isProcessing}
//           className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
//           aria-label="Send message"
//         >
//           {isProcessing ? (
//             <Loader2 className="w-6 h-6 animate-spin" />
//           ) : (
//             <Send className="w-6 h-6" />
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TextProcessor;
import React, { useState, useRef, useEffect } from "react";

import { IoIosSend } from "react-icons/io";
import { RiLoader2Line } from "react-icons/ri";
import { CiCircleAlert } from "react-icons/ci";
import { CiSquareAlert } from "react-icons/ci";

const TextProcessor = () => {
  // Available languages for translation
  const languages = [
    { code: "en", name: "English" },
    { code: "pt", name: "Portuguese" },
    { code: "es", name: "Spanish" },
    { code: "ru", name: "Russian" },
    { code: "tr", name: "Turkish" },
    { code: "fr", name: "French" },
  ];

  // State management
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock API calls (replace with actual Chrome AI API implementations)
  const detectLanguage = async (text) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return "en"; // Mock response
  };

  const summarizeText = async (text) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `Summary of: ${text.substring(0, 50)}...`;
  };

  const translateText = async (text, targetLang) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    return `Translated to ${targetLang}: ${text.substring(0, 30)}...`;
  };

  // Handler functions
  const handleSend = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const detectedLang = await detectLanguage(inputText);

      const newMessage = {
        id: Date.now().toString(),
        text: inputText,
        detectedLanguage: detectedLang,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputText("");

      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (err) {
      setError("Failed to process text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSummarize = async (messageId) => {
    setIsProcessing(true);
    setError(null);

    try {
      const message = messages.find((m) => m.id === messageId);
      if (!message) return;

      const summary = await summarizeText(message.text);

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, summary } : m))
      );
    } catch (err) {
      setError("Failed to summarize text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTranslate = async (messageId) => {
    setIsProcessing(true);
    setError(null);

    try {
      const message = messages.find((m) => m.id === messageId);
      if (!message) return;

      const translation = await translateText(message.text, selectedLanguage);

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, translation } : m))
      );
    } catch (err) {
      setError("Failed to translate text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-800 mb-2">{message.text}</p>

            {message.detectedLanguage && (
              <p className="text-sm text-gray-500 mb-2">
                Language: {message.detectedLanguage}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-2">
              {message.text.length > 150 &&
                message.detectedLanguage === "en" &&
                !message.summary && (
                  <button
                    onClick={() => handleSummarize(message.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Summarize text"
                  >
                    Summarize
                  </button>
                )}

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select target language"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleTranslate(message.id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label="Translate text"
              >
                Translate
              </button>
            </div>

            {message.summary && (
              <div className="bg-blue-50 p-3 rounded mt-2">
                <p className="text-sm font-medium text-blue-800">Summary:</p>
                <p className="text-sm text-blue-700">{message.summary}</p>
              </div>
            )}

            {message.translation && (
              <div className="bg-green-50 p-3 rounded mt-2">
                <p className="text-sm font-medium text-green-800">
                  Translation:
                </p>
                <p className="text-sm text-green-700">{message.translation}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Alert */}
      {error && (
        <CiCircleAlert variant="destructive" className="mb-4">
          <CiSquareAlert>{error}</CiSquareAlert>
        </CiCircleAlert>
      )}

      {/* Input Area */}
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message here..."
          aria-label="Input text"
        />

        <button
          onClick={handleSend}
          disabled={isProcessing}
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          aria-label="Send message"
        >
          {isProcessing ? (
            <RiLoader2Line className="w-6 h-6 animate-spin" />
          ) : (
            <IoIosSend className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
};

export default TextProcessor;
