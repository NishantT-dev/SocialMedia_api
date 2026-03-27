import express from "express"
import { createPost,getAllPosts,getUserPost,deletePost,updatePost, likePost, unlikePost, addCommentToPost } from "../controller/postController.js";
import { verifyToken } from "../middlewares/authiddleware.js";

const postRouter=express.Router();

postRouter.post("/",verifyToken,createPost)
postRouter.get("/",getAllPosts);
postRouter.get("/:id",verifyToken,getUserPost);
postRouter.delete("/:id",verifyToken,deletePost);
postRouter.patch("/:id",verifyToken,updatePost);
postRouter.post("/:id/like",verifyToken,likePost);
postRouter.post("/:id/unlike",verifyToken,unlikePost)
postRouter.post("/:id/comment",verifyToken,addCommentToPost)
export default postRouter