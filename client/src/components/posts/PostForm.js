import React, { useState } from 'react';
import { addPost } from '../../actions/post';
import { useSelector, useDispatch } from 'react-redux';

const PostForm = () => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  //Why not send as string as only one thins is there
  const formSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(addPost({ text }));
    setText('');
  };

  return (
    <div class='post-form'>
      <div class='bg-primary p'>
        <h3>
          Post Something on any of your favourite topic and interact with other
          developers...
        </h3>
      </div>
      <form class='form my-1' onSubmit={formSubmitHandler}>
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <input type='submit' class='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};

export default PostForm;
