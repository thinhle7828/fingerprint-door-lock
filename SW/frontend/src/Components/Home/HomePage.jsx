import { useEffect } from "react";
import "./home.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/authSlice";

const HomePage = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() =>{
    if (!user) return null;
	  if (!user.active) navigate('/');
    if (user.admin === true) navigate('/adminPage')
      else navigate('/clientPage')
  }, []);


  return (
    <main className="home-container">
      <div className="home-title">HOME PAGE</div>
      <div className="home-userlist">
        <div className="imageContainer">
          <img 
          src="https://www.senviet.art/wp-content/uploads/edd/2021/12/dai-hoc-su-pham-tphcm.jpg" 
          alt="Trường DHSPKT"
          className="image"
          />
        </div>
        <div>
          <h3>Chào mừng bạn đến với Web điều khiển</h3>
          <p>Nếu đã là có tài khoản vui lòng đăng nhập để sử dụng</p>
          <p>Nếu là thành viên mới chưa có tài khoản, vui lòng liên hệ với chủ thuê để sử dụng dịch vụ</p>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
