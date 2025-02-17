import React, { useEffect, useState } from 'react';
import './AdminDashboard.css'
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getAllUsers, updateUserStatus } from '../../../../redux/apiRequest';
import { createAxios } from '../../../../createInstance';

const UserList = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const usersList = useSelector((state) => state.users.users?.allUsers);
  const dispatch = useDispatch();

  useEffect(() => {
    if(user?.accessToken) {
      getAllUsers(user?.accessToken, dispatch);
    }
  },[user, dispatch]);
  
  const handleDelete = (id) => {
    deleteUser(user?.accessToken, dispatch, id);
    getAllUsers(user?.accessToken, dispatch);
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    const updatedUsersList = usersList.map((usr) => 
      usr._id === id ? { ...usr, can_open: newStatus } : usr
    );

    dispatch({ type: 'UPDATE_USERS_LIST', payload: updatedUsersList });

    await updateUserStatus(user?.accessToken, dispatch, id, newStatus);
    getAllUsers(user?.accessToken, dispatch);
  };


  return (
    <div className="user-list">
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Open Door</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersList?.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={user.can_open} 
                    onChange={() => handleToggle(user._id, user.can_open)} 
                  />
                  <span className="slider"></span>
                </label>
              </td>
              <td>
                <button onClick={() => handleDelete(user._id)}>
                {" "} Delete {" "}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
