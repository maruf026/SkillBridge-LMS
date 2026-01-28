import type { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.createPost(req.body );
    res.status(201).json(result);
  } catch (error) {
    console.log({ error });
    res
      .status(500)
      .json({
        message:
          error instanceof Error ? error.message : "Internal Server Error!",
      });
  }
};


export const postController= {
    createPost
}