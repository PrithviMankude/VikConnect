import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteComment } from '../../actions/post';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';

const CommentItem = ({
  postId,
  comment: { _id, text, name, avatar, user, date },
}) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onDeleteCommentHandler = (e) => {
    dispatch(deleteComment(postId, _id));
  };

  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>
          Posted on
          {formatDate(date)}{' '}
        </p>
        {!auth.loading && user === auth.user._id && (
          <button
            onClick={onDeleteCommentHandler}
            type='button'
            className='btn btn-danger'
          >
            <i class='fas fa-times'></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
