import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../../createInstance";
import { loginSuccess } from "../../../redux/authSlice";
import "./homeUser.css";
import PageLock from "../../pages/PageLock/PageLock";


const HomeUser = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() => {
    if (!user) {
      navigate('/'); 
    } else if (user.admin) {
      navigate('/adminPage'); 
    } else {
      navigate('/clientPage'); 
    }
  }, [user, navigate]); 


  return (
    <div className="lock-container">
      <PageLock />
    </div>
  );
};

export default HomeUser;
