import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { createProfile, getCurrentProfile } from '../../actions/profile';

/* Form data will all be simple strings, backend we will handle it as obj or any other */

/* Same createProfile reducer action is used for editing also but we will manage it as an bool argument */
/* Here we need to get the profile as we need the fields to be filled before updating.
We will do that using useEffect to get the data */
/* Declaring initialState outside of the component so that it wont triger useEffect.. 
This is outside so it will never change  */
const initialState = {
  company: '',
  website: '',
  location: '',
  status: '',
  skills: '',
  bio: '',
  githubusername: '',
  youtube: '',
  linkedin: '',
  twitter: '',
  facebook: '',
  instagram: '',
};
const EditProfile = () => {
  const { profile, loading } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setformData] = useState(initialState);
  const [displaySocialInputs, setDisplaySocialInputs] = useState(false);

  useEffect(() => {
    if (!profile) getCurrentProfile();

    if (!loading && profile) {
      //dummy just as a placeholder
      const profileData = { ...initialState };

      for (const key in profile) {
        //If its part of profile then we need to copy it
        if (key in profileData) profileData[key] = profile[key];
      }

      for (const key in profile.social) {
        if (key in profileData) profileData[key] = profile.social[key];
      }

      //We will convert array from backend to string
      if (Array.isArray(profileData.skills))
        profileData.skills = profileData.skills.join(',');

      setformData(profileData);
    }
  }, [loading, getCurrentProfile, profile]);

  const {
    company,
    website,
    location,
    status,
    skills,
    bio,
    githubusername,
    youtube,
    linkedin,
    twitter,
    facebook,
    instagram,
  } = formData;

  const toggleSocialInputsHandler = () => {
    setDisplaySocialInputs(!displaySocialInputs);
  };

  const onChangeHandler = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log('In Edit Profile create submit handler');
    dispatch(createProfile(formData, navigate, true));
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>Create your profile </h1>
      <p className='lead'>
        <i className='fas fa-user'></i>
        Let's get some information to build your profile
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={onSubmitHandler}>
        <div className='form-group'>
          <select name='status' value={status} onChange={onChangeHandler}>
            <option value='0'>* Select Professional Status</option>
            <option value='Developer'>Developer</option>
            <option value='Junior Developer'>Junior Developer</option>
            <option value='Senior Developer'>Senior Developer</option>
            <option value='Manager'>Manager</option>
            <option value='Student or Learning'>Student or Learning</option>
            <option value='Instructor'>Instructor or Teacher</option>
            <option value='Intern'>Intern</option>
            <option value='Other'>Other</option>
          </select>
          <small className='form-text'>
            Give us an idea of your current professional standing
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Company'
            name='company'
            value={company}
            onChange={onChangeHandler}
          />
          <small className='form-text'>Your company name</small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Website'
            name='website'
            value={website}
            onChange={onChangeHandler}
          />
          <small className='form-text'>
            If you have a web or your company web
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Location'
            name='location'
            value={location}
            onChange={onChangeHandler}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Skills'
            name='skills'
            value={skills}
            onChange={onChangeHandler}
          />
          <small className='form-text'>
            Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Github Username'
            name='githubusername'
            value={githubusername}
            onChange={onChangeHandler}
          />
          <small className='form-text'>
            If you want your latest repos and a Github link, include your
            username
          </small>
        </div>
        <div className='form-group'>
          <textarea
            placeholder='A short bio of yourself'
            name='bio'
            value={bio}
            onChange={onChangeHandler}
          ></textarea>
        </div>
        <div className='my-2'>
          <button
            onClick={toggleSocialInputsHandler}
            type='button'
            className='btn btn-light'
          >
            Add Social Network Links
          </button>
          {/*<span>*Optional</span>*/}
          <small>*Optional</small>
        </div>
        {/* Show social links only if the condition is true */}
        {displaySocialInputs && (
          <Fragment>
            <div className='form-group social-input'>
              <i className='fab fa-twitter fa-2x'></i>
              <input
                type='text'
                placeholder='Twitter URL'
                name='twitter'
                value={twitter}
                onChange={onChangeHandler}
              />
            </div>
            <div className='form-group social-input'>
              <i className='fab fa-facebook fa-2x'></i>
              <input
                type='text'
                placeholder='Facebook URL'
                name='facebook'
                value={facebook}
                onChange={onChangeHandler}
              />
            </div>
            <div className='form-group social-input'>
              <i className='fab fa-youtube fa-2x'></i>
              <input
                type='text'
                placeholder='YouTube URL'
                name='youtube'
                value={youtube}
                onChange={onChangeHandler}
              />
            </div>
            <div className='form-group social-input'>
              <i className='fab fa-linkedin fa-2x'></i>
              <input
                type='text'
                placeholder='Linkedin URL'
                name='linkedin'
                value={linkedin}
                onChange={onChangeHandler}
              />
            </div>
            <div className='form-group social-input'>
              <i className='fab fa-instagram fa-2x'></i>
              <input
                type='text'
                placeholder='Instagram URL'
                name='instagram'
                value={instagram}
                onChange={onChangeHandler}
              />
            </div>
          </Fragment>
        )}
        <input type='submit' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/dashboard'>
          Go Back
        </Link>
      </form>
    </section>
  );
};

export default EditProfile;

/* 
name is used as an attribute in form because we want to use it as a key for updating the useState for formData
[e.target.name]
*/
