import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getPost } from '../../actions/post';
import { useParams, Link } from 'react-router-dom';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = () => {
  const { post, loading } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch(getPost(params.id));
  }, [getPost]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <div className='container'>
      <Link className='btn btn-primary' to='/posts'>
        Back to Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className='comments'>
        {post.comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </div>
  );
};

export default Post;
