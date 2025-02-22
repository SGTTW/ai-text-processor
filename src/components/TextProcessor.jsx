// import React, { useState, useRef, useEffect } from "react";
// import { IoIosSend } from "react-icons/io";
// import { RiLoader2Line } from "react-icons/ri";
// import { CiCircleAlert } from "react-icons/ci";

// const TextProcessor = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState("");
//   const [selectedLanguage, setSelectedLanguage] = useState("es");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState(null);

//   const messagesEndRef = useRef(null);
//   const textareaRef = useRef(null);

//   // Add this logging to your useEffect
//   useEffect(() => {
//     // Debug logging to check API availability
//     console.log("Window AI object:", window.ai);
//     console.log("Language Detector:", window.ai?.languageDetector);
//     console.log("Translator:", window.ai?.translator);
//     console.log("Summarizer:", window.ai?.summarizer);

//     // Check if running in Chrome
//     const isChrome = /Chrome/.test(navigator.userAgent);
//     console.log("Is Chrome:", isChrome);
//   }, []);

//   // Supported languages (hardcoded as API doesn't provide them)
//   const languages = [
//     { code: "en", name: "English" },
//     { code: "es", name: "Spanish" },
//     { code: "ja", name: "Japanese" },
//   ];

//   // Initialize APIs with tokens
//   useEffect(() => {
//     // Add meta tags with tokens
//     const languageToken = import.meta.env.VITE_LANGUAGE_DETECTION_TOKEN;
//     const translationToken = import.meta.env.VITE_TRANSLATION_TOKEN;
//     const summarizerToken = import.meta.env.VITE_SUMMARIZER_TOKEN;

//     const metaTags = [
//       { token: languageToken, name: "language-detection" },
//       { token: translationToken, name: "translation" },
//       { token: summarizerToken, name: "summarizer" },
//     ];

//     metaTags.forEach(({ token, name }) => {
//       const meta = document.createElement("meta");
//       meta.httpEquiv = "origin-trial";
//       meta.content = token;
//       meta.name = name;
//       document.head.appendChild(meta);
//     });
//   }, []);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);
//   // Modified detectLanguage function
//   const detectLanguage = async (text) => {
//     try {
//       // Ensure text is properly trimmed
//       const trimmedText = text.trim();

//       if (!trimmedText) {
//         throw new Error("Empty text provided");
//       }

//       // FIX 1: Check if Chrome AI API is available
//       if (!window.chrome || !window.chrome.languageDetection) {
//         throw new Error("Language Detection API not available");
//       }

//       // FIX 2: Use the correct Chrome API method
//       // Changed from window.ai.languageDetector to window.chrome.languageDetection
//       const result = await window.chrome.languageDetection.detectLanguage(
//         trimmedText
//       );

//       // FIX 3: Handle the response format correctly
//       if (!result || !result.languages || result.languages.length === 0) {
//         throw new Error("No detection result received");
//       }

//       // FIX 4: Get the most confident language
//       const detectedLang = result.languages[0];

//       return {
//         detectedLanguage: detectedLang.language,
//         confidence: detectedLang.percentage / 100, // Convert percentage to decimal
//         humanReadable: new Intl.DisplayNames(["en"], { type: "language" }).of(
//           detectedLang.language
//         ),
//       };
//     } catch (error) {
//       console.error("Language detection error:", error);
//       throw new Error(`Language detection failed: ${error.message}`);
//     }
//   };

//   // Modified translateText function
//   const translateText = async (text, sourceLang, targetLang) => {
//     try {
//       // FIX 5: Use correct Chrome translation API
//       if (!window.chrome || !window.chrome.translation) {
//         throw new Error("Translation API not available");
//       }

//       const result = await window.chrome.translation.translateText({
//         text: text.trim(),
//         fromLanguage: sourceLang,
//         toLanguage: targetLang,
//       });

//       return result.translatedText;
//     } catch (error) {
//       throw new Error("Translation failed: " + error.message);
//     }
//   };

//   // Modified summarizeText function
//   const summarizeText = async (text) => {
//     try {
//       // FIX 6: Use correct Chrome summarization API
//       if (!window.chrome || !window.chrome.summarization) {
//         throw new Error("Summarization API not available");
//       }

//       const result = await window.chrome.summarization.summarize(text.trim());
//       return result.summary;
//     } catch (error) {
//       throw new Error("Summarization failed: " + error.message);
//     }
//   };

//   const handleSend = async () => {
//     if (!inputText.trim()) {
//       setError("Please enter some text");
//       return;
//     }

//     setIsProcessing(true);
//     setError(null);

//     try {
//       const { detectedLanguage, confidence, humanReadable } =
//         await detectLanguage(inputText);

//       const newMessage = {
//         id: Date.now().toString(),
//         text: inputText,
//         detectedLanguage,
//         confidence,
//         humanReadableLang: humanReadable,
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, newMessage]);
//       setInputText("");

//       if (textareaRef.current) {
//         textareaRef.current.focus();
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleTranslate = async (messageId) => {
//     setIsProcessing(true);
//     setError(null);

//     try {
//       const message = messages.find((m) => m.id === messageId);
//       if (!message) throw new Error("Message not found");

//       const translation = await translateText(
//         message.text,
//         message.detectedLanguage,
//         selectedLanguage
//       );

//       setMessages((prev) =>
//         prev.map((m) => (m.id === messageId ? { ...m, translation } : m))
//       );
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleSummarize = async (messageId) => {
//     setIsProcessing(true);
//     setError(null);

//     try {
//       const message = messages.find((m) => m.id === messageId);
//       if (!message) throw new Error("Message not found");

//       const summary = await summarizeText(message.text);

//       setMessages((prev) =>
//         prev.map((m) => (m.id === messageId ? { ...m, summary } : m))
//       );
//     } catch (err) {
//       setError(err.message);
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
//                 Language: {message.humanReadableLang}
//                 {message.confidence &&
//                   ` (Confidence: ${(message.confidence * 100).toFixed(1)}%)`}
//               </p>
//             )}

//             <div className="flex flex-wrap gap-2 mb-2">
//               {message.text.length > 100 && !message.summary && (
//                 <button
//                   onClick={() => handleSummarize(message.id)}
//                   disabled={isProcessing}
//                   className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 focus:outline-none focus:ring-2 disabled:opacity-50"
//                 >
//                   Summarize
//                 </button>
//               )}

//               <>
//                 <select
//                   value={selectedLanguage}
//                   onChange={(e) => setSelectedLanguage(e.target.value)}
//                   className="border rounded px-3 py-2 focus:outline-none focus:ring-2"
//                   disabled={isProcessing}
//                 >
//                   {languages.map((lang) => (
//                     <option key={lang.code} value={lang.code}>
//                       {lang.name}
//                     </option>
//                   ))}
//                 </select>

//                 <button
//                   onClick={() => handleTranslate(message.id)}
//                   disabled={isProcessing}
//                   className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 disabled:opacity-50"
//                 >
//                   Translate
//                 </button>
//               </>
//             </div>

//             {message.summary && (
//               <div className="bg-purple-50 p-3 rounded mt-2">
//                 <p className="text-sm font-medium text-purple-800">Summary:</p>
//                 <p className="text-sm text-purple-700">{message.summary}</p>
//               </div>
//             )}

//             {message.translation && (
//               <div className="bg-green-50 p-3 rounded mt-2">
//                 <p className="text-sm font-medium text-green-800">
//                   Translation:
//                 </p>
//                 <p className="text-sm text-green-700">{message.translation}</p>
//               </div>
//             )}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="flex items-center gap-2 text-red-600 mb-4">
//           <CiCircleAlert className="w-5 h-5" />
//           <span>{error}</span>
//         </div>
//       )}

//       {/* Input Area */}
//       <div className="flex gap-2 items-end">
//         <textarea
//           ref={textareaRef}
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//           onKeyPress={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault();
//               handleSend();
//             }
//           }}
//           className="flex-1 min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2"
//           placeholder="Type your message here..."
//           disabled={isProcessing}
//         />

//         <button
//           onClick={handleSend}
//           disabled={isProcessing}
//           className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 disabled:opacity-50"
//         >
//           {isProcessing ? (
//             <RiLoader2Line className="w-6 h-6 animate-spin" />
//           ) : (
//             <IoIosSend className="w-6 h-6" />
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TextProcessor;

// --------------------------------------

import React, { useState, useRef, useEffect } from "react";
import { IoIosSend } from "react-icons/io";
import { RiLoader2Line } from "react-icons/ri";
import { CiCircleAlert } from "react-icons/ci";

const languageTagToHumanReadable = (languageTag) => {
  const displayNames = new Intl.DisplayNames(["en"], {
    type: "language",
  });
  return displayNames.of(languageTag);
};

const TextProcessor = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("es");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Supported languages
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish (Español)" },
    { code: "pt", name: "Portuguese (Português)" },
    { code: "fr", name: "French (Français)" },
    { code: "tr", name: "Turkish (Türkçe)" },
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const detectLanguage = async (text) => {
    try {
      const detector = await self.ai.languageDetector.create();
      const result = await detector.detect(text.trim());
      const { detectedLanguage, confidence } = result[0];

      return {
        detectedLanguage,
        confidence,
        humanReadable: languageTagToHumanReadable(detectedLanguage),
      };
    } catch (error) {
      console.error("Language detection error:", error);
      throw new Error(`Language detection failed: ${error.message}`);
    }
  };

  const translateText = async (text, sourceLang, targetLang) => {
    try {
      const translatorModel = await self.ai.translator.capabilities();
      const canTranslate = translatorModel.languagePairAvailable(
        sourceLang,
        targetLang
      );

      if (!canTranslate) {
        throw new Error(
          `Translation from ${languageTagToHumanReadable(
            sourceLang
          )} to ${languageTagToHumanReadable(targetLang)} is not supported.`
        );
      }

      const translator = await self.ai.translator.create({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });

      return await translator.translate(text.trim());
    } catch (error) {
      throw new Error("Translation failed: " + error.message);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { detectedLanguage, confidence, humanReadable } =
        await detectLanguage(inputText);

      const newMessage = {
        id: Date.now().toString(),
        text: inputText,
        detectedLanguage,
        confidence,
        humanReadableLang: humanReadable,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputText("");

      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTranslate = async (messageId) => {
    setIsProcessing(true);
    setError(null);

    try {
      const message = messages.find((m) => m.id === messageId);
      if (!message) throw new Error("Message not found");

      const translation = await translateText(
        message.text,
        message.detectedLanguage,
        selectedLanguage
      );

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, translation } : m))
      );
    } catch (err) {
      setError(err.message);
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
                Language: {message.humanReadableLang}
                {message.confidence &&
                  ` (Confidence: ${(message.confidence * 100).toFixed(1)}%)`}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2"
                disabled={isProcessing}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleTranslate(message.id)}
                disabled={isProcessing}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 disabled:opacity-50"
              >
                Translate
              </button>
            </div>

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

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <CiCircleAlert className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2"
          placeholder="Type your message here..."
          disabled={isProcessing}
        />

        <button
          onClick={handleSend}
          disabled={isProcessing}
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 disabled:opacity-50"
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

// import React from "react";

// const TextProcessor = () => {
//   return (
//     <div>
//       <h3>omoooo</h3>
//     </div>
//   );
// };

// export default TextProcessor;
