import { useEffect,useState } from "react";
import { getAllUsers } from "../../../redux/apiRequest";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../../createInstance";
import { loginSuccess } from "../../../redux/authSlice";
import UserList from "./AdminComponents/UserList";
import LoginHistory from "./AdminComponents/LoginHistory";
import WarningImage from "./AdminComponents/WarningImage";
import PageLock from "../../pages/PageLock/PageLock";



const HomeAdmin = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() => {
    if (!user) {
      navigate('/'); 
    } else if (user.admin) {
      navigate('/adminPage'); 
    } else {
      navigate('/clientPage'); 
    }
  }, []); 

    const renderContent = () => {
      switch (activeTab) {
        case 'homePage':
        return <PageLock />
        case 'users':
          return <UserList />;
        case 'loginHistory':
          return <LoginHistory />;
          case 'image':
            return <WarningImage />;
        default:
          return <UserList />;
      }
    };
    


    return (
      <div className="admin-container">
        <header className="admin-header">
          {/* <h1>Admin</h1> */}
          <nav>
            <button onClick={() => setActiveTab('homePage')} className={activeTab === 'homePage' ? 'active' : ''}>Home Page</button>
            <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>Users</button>
            <button onClick={() => setActiveTab('loginHistory')} className={activeTab === 'loginHistory' ? 'active' : ''}>Login History</button>
            <button onClick={() => setActiveTab('image')} className={activeTab === 'image' ? 'active' : ''}>Captured Images</button> 
          </nav>
        </header>
        <main className="admin-content">
          {renderContent()}
        </main>
      </div>
    );
  };
export default HomeAdmin;
