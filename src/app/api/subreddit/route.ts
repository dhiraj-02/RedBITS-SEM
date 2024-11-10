import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { SubredditValidator } from '@/lib/validators/subreddit'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name } = SubredditValidator.parse(body)

    // check if subreddit already exists
    const subredditExists = await db.subreddit.findFirst({
      where: {
        name,
      },
    })

    if (subredditExists) {
      return new Response('Subreddit already exists', { status: 409 })
    }

    // create subreddit and associate it with the user
    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    })

    // creator also has to be subscribed
    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      },
    })

    return new Response(subreddit.name)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response('Could not create subreddit', { status: 500 })
  }
}

export async function DELETE(req: Request) {

  const url = new URL(req.url);  // Parse the request URL
  const subredditId = url.searchParams.get('id');  // Extract the 'id' query parameter

  if (!subredditId) {
    return new Response(
      'Community ID is required',
      { status: 400 }
    );
  }

  try {

    const posts = await db.post.findMany({
      where: { subredditId: subredditId },
    });
  
    const deleteCommentAndReplies = (commentId: string) => {
      return new Promise<void>(async (resolve, reject) => {
        await db.comment.deleteMany({
          where: { replyToId: commentId },
        });

        await db.comment.delete({
          where: { id: commentId },
        });

        resolve()
      })
    };

    const deletePost = (postId: string) => {
      return new Promise<void>(async(resolve, reject) => {
        const comments = await db.comment.findMany({
          where: {postId: postId}
        })
  
        for(const comment of comments){
          if (!comment.replyToId) {
            await deleteCommentAndReplies(comment.id);
          }
        }
  
        await db.post.delete({
          where: { id: postId },
        });
        resolve()
      })
    }
  
    for (const post of posts) {
      await deletePost(post.id)
    }

    await db.subscription.deleteMany({
      where:{subredditId: subredditId}
    })

    await db.subreddit.delete({
      where: {id: subredditId}
    })


    return new Response(
      'Community deleted successfully',
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return new Response(
      'Community could not be deleted at this moment.',
      { status: 500 }
    )
  }
}