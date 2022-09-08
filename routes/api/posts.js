const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth_mw');
const User = require('../../models/User');
const Post = require('../../models/Post');
const { check, validationResult } = require('express-validator');

//@route    - POST /api/posts
//@desc     - Create a post
//@Access   - Private
router.post(
  '/',
  [auth, [check('text', 'Text cant be empty for comment').notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      //We dont have to check the user as MW does it

      //Set up the post obj
      const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      });

      //Post is on its own, so not inserting onside a user rather a post will have user details

      const post = await newPost.save();
      return res.status(200).json(post);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

//@route    - GET /api/posts
//@desc     - Get all posts
//@Access   - Private
//Private because, a member has to login to see the posts, can be public too but this is better

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); //Sort by the most recent

    return res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route    - GET /api/posts/:id
//@desc     - Get a post by id
//@Access   - Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'There is no post by the given ID' });
    }
    res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'There is no post by the given ID' });
    }
    res.status(500).send('Server error');
  }
});

//@route    - DELETE /api/posts/:id
//@desc     - Del a post by id
//@Access   - Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if the user is the owner of the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();
    res.status(200).json({ msg: 'Post removed..good' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@route    - PUT /api/posts/like/:id
//@desc     - Like a post by id
//@Access   - Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if the post is already liked by the user.Post schema for like has list of users
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post has already been liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    - PUT /api/posts/unlike/:id
//@desc     - Unlike a post by id
//@Access   - Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Check if the post has not yet been liked
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // remove the like
    post.likes = post.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );

    await post.save();
    res.status(200).json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@route    - PUT /api/posts/comment/:id
//@desc     - Comment a post by id
//@Access   - Private
router.post(
  '/comment/:id',
  [auth, check('text', 'Text for comment is required').notEmpty()],
  async (req, res) => {
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };

      //add it to post-- we simply add it to the beginning of comment array
      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);

      if (!post) {
        return res
          .status(404)
          .json({ msg: 'The post with the given Id was nt found' });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route    - DELETE /api/posts/comment/:id/comment_id
//@desc     - Delete a comment
//@Access   - Private
router.delete('/comment/:id/:comment_id', [auth], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Now we got the post, pull the comment with the given if out of it
    //comment = post.comments -- WIll pull all the comments so
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    const del = post.comments.map((comment) =>
      console.log(`The comment Id is ${comment.id}`)
    );

    if (!comment) {
      return res.json(404).json({ msg: 'The comment does not exist' });
    }

    //check user-- Only user should be able to delete his comment
    if (comment.user.toString() !== req.user.id) {
      return res.json({ msg: 'User not authorized' });
    }

    //id is used here as it is string version of _id and req.params.id is also of type string
    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await post.save();

    return res.json(post.comments);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
