import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
    title: {
      type: String,
      required: [true, "Title of Post is required"],
    },
    description: {
      type: String,
      required: false,
    },
    images: [
      {
        imageUrl: { type: String, required: true },
        imgCaption: { type: String, default: "" },
      },
    ],
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
    isDeleted: {
      type: Boolean, 
      default: false,
    },
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", postSchema);
export default Post;
