import "./App.css";
import Navbar from "./components/_user/Navbar/Navbar";
function App() {
  return (
    <>
      <h2 className="text-meta-6 bg-blue text-3xl underline">App Component</h2>
      <Navbar />
    </>
  );
}

export const Header = () => {
  return <nav>Header</nav>;
};

export default App;
