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
