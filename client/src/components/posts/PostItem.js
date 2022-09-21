import React from 'react';
import formatDate from '../../utils/formatDate';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';

//const PostItem = ({ _id, text, name, avatar, user, likes, comments, date }) => {
const PostItem = ({
  post: { _id, text, name, avatar, user, likes, comments, date }, showActions = true,
}) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  console.log('POST user =:', user);
  console.log('Likes: ', likes.length);

  const onClickLikeHandler = (e) => {
    dispatch(addLike(_id));
  };

  const onClickUnikeHandler = (e) => {
    dispatch(removeLike(_id));
  };

  const onClickDeleteHandler = (e) => {
    dispatch(deletePost(_id));
  };
  return (
    <section className='container'>
      <div className='post bg-white p-1 my-1'>
        <div>
          <Link to={`/profile/${user}`}>
            <img className='round-img' src={avatar} alt='' />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p className='my-1'>{text}</p>
          <p className='post-date'>{formatDate(date)} Posted On: </p>
          {showActions && (
            <>
              <button
                onClick={onClickLikeHandler}
                type='button'
                className='btn btn-light'
              >
                <i className='fas fa-thumbs-up'></i> {'  '}
                <span>{likes.length}</span>
              </button>
              <button
                onClick={onClickUnikeHandler}
                type='button'
                className='btn btn-light'
              >
                <i className='fas fa-thumbs-down'></i>
              </button>
              <Link to={`/posts/${_id}`} className='btn btn-primary'>
                Discussion{'  '}
                {comments.length > 0 && (
                  <span className='comment-count'> {comments.length}</span>
                )}
              </Link>
              {!auth.loading && user === auth.user._id && (
                <button
                  onClick={onClickDeleteHandler}
                  type='button'
                  className='btn btn-danger'
                >
                  {/*<i className='fas fa-times'></i>*/}
                  Delete Post
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default PostItem;
