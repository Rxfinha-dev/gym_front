import Login from './components/LoginForm/index';
import User from './components/User/UserForm/index';
import UserList from './components/User/ListUser';
import UserUpdate from './components/User/UpdateUser/updateUser';
import Plan from './components/Plan/PlanForm/index';
import PlanList from './components/Plan/ListPlan';
import Payment from './components/Payment/ListPayment/index';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import { AuthProvider } from './helpers/AuthContext';
import PlanEdit from './components/Plan/UpdatePlan/updatePlan';
import NotificationSettings from './components/Company/index';
import CompanyForm from './components/Company/CompanyForm/index';
import CompanyList from './components/Company/CompanyList';
import ChangePassword from './components/Company/CompanyChangePassword';
import LandingPage from './components/LandingPage/LandingPage';

function App() {
  return (
    <Router>
      <AuthProvider>
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/user-list" element={<UserList />} />
        <Route exact path="/user" element={<User />} />
        <Route exact path="/user/edit/:userId" element={<UserUpdate />} />
        <Route exact path="/plan" element={<Plan />} />
        <Route exact path="/plan/edit/:planId" element={<PlanEdit />} />
        <Route exact path="/plan-list" element={<PlanList />} />
        <Route exact path="/payment" element={<Payment />} />
        <Route exact path="/company" element={<NotificationSettings />} />
        <Route exact path='/company-form' element={<CompanyForm />}></Route>
        <Route exact path='/company-list' element={<CompanyList/>}></Route>
        <Route exact path='/change-password' element={<ChangePassword/>}></Route>
      </Routes>
      </AuthProvider>
      
    </Router>
  );
}

export default App;
