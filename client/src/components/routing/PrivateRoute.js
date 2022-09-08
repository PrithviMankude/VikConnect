import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
/*
const PrivateRoute = ({ component: Component }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (!loading && isAuthenticated) return <Component />;

  return <Navigate to='login' />;
};
*/

const PrivateRoute = ({ children }) => {
  console.log('In Private Route');
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  console.log('IS Auth : ' + isAuthenticated);
  console.log('Loading : ' + loading);
  return isAuthenticated ? children : <Navigate to='/login' />;
};

export default PrivateRoute;
