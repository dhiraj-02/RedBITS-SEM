import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: Request) {
  const url = new URL(req.url)

  const session = await getAuthSession()

  let followedCommunitiesIds: string[] = []

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        subreddit: true,
      },
    })

    followedCommunitiesIds = followedCommunities.map((sub) => sub.subreddit.id)
  }

  try {
    const { limit, page, subredditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional(),
      })
      .parse({
        subredditName: url.searchParams.get('subredditName'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
      })

    let whereClause = {}

    if (subredditName) {
      whereClause = {
        subreddit: {
          name: subredditName,
        },
      }
    } else if (session) {
      whereClause = {
        subreddit: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      }
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    })

    return new Response(JSON.stringify(posts))
  } catch (error) {
    return new Response('Could not fetch posts', { status: 500 })
  }
}

export async function DELETE(req: Request) {

  const url = new URL(req.url);  // Parse the request URL
  const postId = url.searchParams.get('id');  // Extract the 'id' query parameter

  if (!postId) {
    return new Response(
      'Post ID is required',
      { status: 400 }
    );
  }

  try {

    const comments = await db.comment.findMany({
      where: { postId: postId },
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
  
    for (const comment of comments) {
      if (!comment.replyToId) {
        await deleteCommentAndReplies(comment.id);
      }
    }
  
    await db.post.delete({
      where: { id: postId },
    });

    return new Response(
      'Post deleted successfully',
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return new Response(
      'Post could not be deleted at this moment.',
      { status: 500 }
    )
  }
}


