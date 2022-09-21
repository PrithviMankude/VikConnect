import React, { Fragment, useEffect } from 'react';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../actions/profile';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileGithub from './ProfileGithub';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';

const Profile = ({ match }) => {
  const dispatch = useDispatch();
  const params = useParams();

  const { profile, loading } = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProfileById(params.id));
  }, [getProfileById]);

  return (
    <Fragment>
      <section className='container'>
        {profile === null || loading ? (
          <Spinner />
        ) : (
          <Fragment>
            <Link className='btn btn-light' to='/profiles'>
              Back to profiles
            </Link>
            {auth.isAuthenticated &&
              auth.loading === false &&
              auth.user._id === profile.user._id && (
                <Link to='/edit-profile' className='btn btn-dark'>
                  Edit your profile
                </Link>
              )}
            <div className='profile-grid my-1'>
              <ProfileTop profile={profile} />
              <ProfileAbout profile={profile} />
              <div className='profile-exp bg-white p-2 '>
                <h2 className='text-primary'>Experience Details</h2>
                {profile.experience.length > 0 ? (
                  <Fragment>
                    {profile.experience.map((exp) => (
                      <ProfileExperience key={exp._id} experience={exp} />
                    ))}
                  </Fragment>
                ) : (
                  <h4>No Experience Credentials found...</h4>
                )}
              </div>

              <div className='profile-edu bg-white p-2 '>
                <h2 className='text-primary'>Education Details</h2>
                {profile.education.length > 0 ? (
                  <Fragment>
                    {profile.education.map((edu) => (
                      <ProfileEducation key={edu._id} education={edu} />
                    ))}
                  </Fragment>
                ) : (
                  <h4>No Education Details found...</h4>
                )}
              </div>

              {profile.githubusername && (
                <ProfileGithub username={profile.githubusername} />
              )}
            </div>
          </Fragment>
        )}
      </section>
    </Fragment>
  );
};

export default Profile;
