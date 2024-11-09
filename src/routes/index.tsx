import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../pages/Login';
import Users from '../pages/Users';

// 简单的路由守卫组件
const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<Layout />} />}>
          <Route index element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes; 