// // import TextProcessor from "./components/TextProcessor";
// export const languageTagToHumanReadable = (languageTag) => {
//   const displayNames = new Intl.DisplayNames(["en"], {
//     type: "language",
//   });
//   return displayNames.of(languageTag);
// };

// import TextProcessor from "./components/TextProcessor";

// function App() {
//   const textDetection = async () => {
//     // const detector = await self.ai.languageDetector.create();

//     const languageModel = await self.ai.languageDetector.capabilities();
//     const canDetect = languageModel.available;
//     // console.log(canDetect);
//     const detector = await self.ai.languageDetector.create();
//     // console.log("detector status: " + detector);

//     const result = await detector.detect("Hello, how are you?");
//     // console.log(result);
//     const { detectedLanguage, confidence } = result[0];
//     console.log(
//       `The text is in ${languageTagToHumanReadable(detectedLanguage)} i'm ${
//         confidence * 100
//       }% sure.`
//     );
//   };

//   // textDetection();

//   const textTranslate = async () => {
//     const srcLang = "en";
//     const targetLang = "es";
//     const text = "He decided to count all the sand on the beach as a hobby";

//     const translatorModel = await self.ai.translator.capabilities();
//     const canDetect = translatorModel.languagePairAvailable(
//       srcLang,
//       targetLang
//     );
//     console.log(":rocket: ~ canDetect:", canDetect);
//     const translator = await self.ai.translator.create({
//       sourceLanguage: srcLang,
//       targetLanguage: targetLang,
//     });

//     const result = await translator.translate(text);
//     console.log(":rocket: ~ result:", result);
//   };

//   textTranslate();
//   return (
//     <>
//       {/* <TextProcessor /> */}
//       <div>
//         <h2>work oo</h2>
//       </div>
//     </>
//   );
// }

// export default App;

import TextProcessor from "./components/TextProcessor";

function App() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">AI Text Processor</h1>
        <TextProcessor />
      </div>
    </div>
  );
}

export default App;
