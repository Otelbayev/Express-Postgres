import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import Bottom from "./components/bottom";
import Home from "./pages/home";
import Archive from "./pages/archive";
import Setting from "./pages/setting";
import HomeProvider from "./context/home-context";

const App = () => {
  return (
    <HomeProvider>
      <BrowserRouter>
        <Header />
        <div className="min-h-[calc(100vh-72px)] bg-slate-50 font-sans text-slate-900 pb-24 select-none">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </div>
        <Bottom />
      </BrowserRouter>
    </HomeProvider>
  );
};

export default App;
