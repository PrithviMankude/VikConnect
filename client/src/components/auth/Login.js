import React, { Fragment, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { login } from '../../actions/auth';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
  const [formData, setformData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const { email, password } = formData;

  const onChangeHandler = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    dispatch(login({ email, password }));
  };

  //Redirect if logged in after all the work, else we will be simply sitting in the same page.  mind the return
  if (isAuthenticated) {
    return <Navigate to='/dashboard' />;
  }

  return (
    <Fragment>
      <section className='container'>
        <h1 className='large text-primary'>Sign In</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Sign Into Your Account
        </p>
        <form className='form' onSubmit={onSubmitHandler}>
          <div className='form-group'>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              value={email}
              onChange={onChangeHandler}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              minLength='3'
              value={password}
              onChange={onChangeHandler}
            />
          </div>

          <input type='submit' className='btn btn-primary' value='Login' />
        </form>
        <p className='my-1'>
          Dont have an account? <Link to='/register'>Sign Up</Link>
        </p>
      </section>
    </Fragment>
  );
};

export default Login;
