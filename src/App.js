import "./App.css";
import PostList from "./components/PostList.js";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Blog App con React y Tailwind CSS
        </h1>
        <PostList />
      </div>
    </div>
  );
}

export default App;
