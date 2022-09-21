import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComment } from '../../actions/post';

const CommentForm = (postId) => {
  const dispatch = useDispatch();

  const [text, setText] = useState('');

  console.log('Post ID: ', postId);
  console.log(typeof postId);

  const formSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(addComment(postId, { text }));
    setText('');
  };
  return (
    <div class='post-form'>
      <div class='bg-primary p'>
        <h3>Add a comment</h3>
      </div>
      <form class='form my-1' onSubmit={formSubmitHandler}>
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Add comment'
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <input type='submit' class='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};

export default CommentForm;
