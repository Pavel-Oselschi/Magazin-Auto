
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import AdminPanel from './pages/AdminPanel';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import CarDetails from './pages/CarDetails';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import './App.css';


  

function App() {
  return (
    <Router>
        <Navbar />
        <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/catalog' element={<Catalog />} />
            <Route path="/catalog/:id" element={<CarDetails />} />
        <Route path='/car/:id' element={<CarDetails />} />
            <Route path="/cart" element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path="/admin" element={<PrivateRoute>  <AdminPanel /> </PrivateRoute>} />


        <Route path='/cart' element={<Cart />} />
       </Routes>

    </Router>
    
  );
  
}




export default App;
    