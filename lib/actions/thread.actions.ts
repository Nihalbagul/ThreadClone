"use server"
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { connectToDB } from "../mongoose";
import User from "../models/user.models"; // Changed from user.models to user.model
import path from "path";
import { string } from "zod";

interface Params {
  text: string;
  author: string;
  communityId: string;
  path: string;
}

export async function createThread({ text, author, communityId, path }: Params) { // Destructuring Params object properly
  try {
    connectToDB();

    const createdThread = await Thread.create({
      text,
      author,
      community: communityId, // Assuming communityId corresponds to community field
    });

    // Update user model
    await User.findByIdAndUpdate(author, {
      $push: { thread: createdThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating thread: ${error.message}`);
  }
}

export async function fetchPost(pageNumber =1,pageSize=20) {
  connectToDB();
  const skipAmount = (pageNumber-1)*pageSize;
  const postsQuery = Thread.find({parentId: {$in:[null,undefined]}})
  .sort({created: 'desc'})
  .skip(skipAmount)
  .limit(pageSize)
  .populate({path:'author',model:User})
  .populate({path:'children',
    populate:{
      path:'author',
      model:User,
      select:"_id name parentId image"
    }
})
const totalPostCount = await Thread.countDocuments({parentId: {
  $in: [null,undefined]
}})
const posts = await postsQuery.exec();
const isNext = totalPostCount> skipAmount +posts.length;
return {posts,isNext};
}


export async function fetchThreadById(threadId: string) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
       // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}

export async function addCommnetToThread( 
  threadId:string,
  commentText:string,
  userId:string,
  path:string,
)
{
  connectToDB();
  try{
    //find the original thread by its id
    const originalThread = await Thread.findById(threadId);
    if(!originalThread){
      throw new Error("Thread not found")
    }
    //create a new thread with the comment text
    const commentThread =new Thread({
      text: commentText,
      author: userId,
      parentId:threadId,
    })
    //save the new thread
    const savedCommentThread = await commentThread.save();
    originalThread.children.push(savedCommentThread._id);
    await originalThread.save();
    revalidatePath(path);
  }catch(error:any)
  {
    throw new Error(`Error adding commnet to thread :${ error.message}`)
  }
}

export async function fetchUserPosts(userId:string) {
  try{
    connectToDB();
    //find all thread authote bvy users 
    const thread = await User.findOne({id:userId})
    .populate({
      path:'thread',
      model:Thread,
      populate:{
        path:'children',
        model: Thread,
        populate:{
          path:'author',
          model:User,
          select:'name image id',
        }
      }
    })
    return thread;
  }catch(error:any)
  {
    throw new Error(`Failed to fetch user posts: ${error.message}`)
  }
}