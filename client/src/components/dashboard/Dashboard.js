import React, { useEffect, Fragment } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import { deleteAccount } from '../../actions/profile';
import Experience from './Experience';
import Education from './Education';

const Dashboard = () => {
  const dispatch = useDispatch(); //To dispatch getCurrentProfile action to the redux actions

  const { profile, loading } = useSelector((state) => state.profile);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  //We need to load the user Profile as soon as logged in, so good to use useEffect
  useEffect(() => {
    console.log('Profile exists: Value ', profile);
    //if (profile)
    dispatch(getCurrentProfile());
  }, [getCurrentProfile]);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <section className='container'>
        <h1 className='large text-primary'>Dashboard</h1>
        <p className='lead'>
          <i className='fas fa-user'></i>
          {'     '}
          Welcome: {user && user.name}
        </p>
        {profile !== null ? (
          <Fragment>
            <DashboardActions />
            <Experience experience={profile.experience} />
            <Education education={profile.education} />

            <div className='my-2'>
              <button
                className='btn btn-danger'
                onClick={() => dispatch(deleteAccount())}
              >
                <i className='fas fa-user-minus'></i> Delete My Account
              </button>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <p>
              You have not setup a profile Please create a profile by clicking
              the link{' '}
            </p>{' '}
            <Link to='/create-profile' className='btn btn-primary my-1'>
              Create Profile
            </Link>
          </Fragment>
        )}
      </section>
    </Fragment>
  );

  {
    /*}
  return (
    <>console.log(loa);
      if(loading){<Spinner />}
      <h1>Dashboard</h1>
      <div>dashboard...</div>
    </>
  );
  */
  }
};

export default Dashboard;
