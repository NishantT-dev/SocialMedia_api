import Post from "../model/postModel.js";
import Comment from "../model/commentModel.js";
import logger from "../utils/logger.js";

const createPost = async (req, res) => {
  try {
    const { title, description, images } = req.body;
    const userId = req.user.id;
    const newPost = await Post.create({
      user: userId,
      title,
      description,
      images,
    });
    return res
      .status(201)
      .json({ message: "Post created successfully", newPost });
  } catch (err) {
    logger.error(`Error creating Posts ${err.message} `);
    res.status(500).json({ message: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, description, images } = req.body;
    const userId = req.user.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "User not authorized to update the post" });
    }
    if (req.body.title !== undefined) post.title = req.body.title;
    if (req.body.description !== undefined)
      post.description = req.body.description;
    if (req.body.images !== undefined) post.images = req.body.images;
    const updatedPost = await Post.save();
    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (err) {
    logger.error(`Error creating Posts ${err.message} `);
    res.status(500).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  const userId = req.user.id;
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: " The requested post not found" });
    }
    if (post.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete post" });
    }

    post.isDeleted = true;
    await post.save();
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    logger.error(`Error deleting Posts ${err.message} `);
    res.status(500).json({ message: err.message });
  }
};

const getUserPost = async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await Post.find({ user: userId, isDeleted: false })
      .populate("user", "userName profilePicture")
      .populate("comments");

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    return res.status(200).json({
      message: "User posts fetched successfully",
      posts,
    });
  } catch (err) {
    logger.error(`Error fetching user posts: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isDeleted: false })
      .populate("user", "userName profilePicture")
      .populate("comments");
    return res.status(200).json({ message: "All posts fetched ", posts });
  } catch (err) {
    logger.error(`Error creating Posts ${err.message} `);
    res.status(500).json({ message: err.message });
  }
};

const unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user has liked before
    if (!post.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You haven't liked this post yet" });
    }

    post.likes = post.likes.filter((id) => id.toString() !== userId);
    await post.save();

    return res.status(200).json({ message: "Post unliked successfully", post });
  } catch (err) {
    logger.error(` Error unliking post ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: " You already liked this post" });
    }
    post.likes.push(userId);
    await post.save();
    return res.status(200).json({ message: "Post liked successfully" });
  } catch (err) {
    logger.error(` Error liking post ${err.message}`);
  }
};
const addCommentToPost=async(req,res)=>{
  try{ const{postId}=req.params.id;
  const{userId}=req.user.id;
  const {text}=req.body;
  const post=await Post.findById(postId);
  if(!post){
    return res.status(404).json({message:"Post not found"});
  }
const comment=await Comment.create({user:userId,post:postId,text});
post.comments.push(comment._id);
await post.save();
return res.status(201).json({message:"Comment added successfully",comment})
  } catch(err){
    logger.error(` Error while adding comment to post ${err.message}`);
    res.status(500).json({message:err.message})
  }
}
export {
  createPost,
  getAllPosts,
  getUserPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,addCommentToPost
};
