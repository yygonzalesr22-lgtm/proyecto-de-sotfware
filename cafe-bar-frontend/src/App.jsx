import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Usuarios from "./pages/Usuarios";
import Inventario from "./pages/Inventario";
import Reportes from "./pages/Reportes";
import Categorias from "./pages/Categorias";
import Productos from "./pages/Productos";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export default function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router>
      {isLoggedIn && <Navbar />}
      <div className="flex">
        {isLoggedIn && <Sidebar />}

        {/* CONTENIDO PRINCIPAL */}
        <main className={`${isLoggedIn ? 'ml-64' : ''} flex-1 ${isLoggedIn ? 'p-8 bg-gray-100 min-h-screen' : ''}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
            <Route path="/categorias" element={<PrivateRoute><Categorias /></PrivateRoute>} />
            <Route path="/productos" element={<PrivateRoute><Productos /></PrivateRoute>} />
            <Route path="/inventario" element={<PrivateRoute><Inventario /></PrivateRoute>} />
            <Route path="/reportes" element={<PrivateRoute><Reportes /></PrivateRoute>} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}
