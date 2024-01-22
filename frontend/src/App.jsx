import "./App.css";
import Navbar from "./components/_user/Navbar/Navbar";
function App() {
  return (
    <>
      <Navbar />
      <div className="py-40 bg-primary"></div>
    </>
  );
}

export const Header = () => {
  return <nav>Header</nav>;
};

export default App;
