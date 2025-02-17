import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./PassWord.css"
import { changePassword } from "../../../redux/apiRequest";

const ChangePassword = () => {
  const user = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const accessToken = user?.accessToken;
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
        navigate('/');
        return;
      }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    const payload = {
      currentPassword,
      newPassword,
      userId: user?._id,
    };

    try {
        await changePassword(dispatch, payload, accessToken);
        setSuccess("Password changed successfully!");
        setError(null);
        navigate("/");
    } catch (error) {
        setError("Password change failed. Please try again.");
        setSuccess(null);
    }
};

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="change-password-button">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
