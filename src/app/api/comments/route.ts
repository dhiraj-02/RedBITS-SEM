import { db } from '@/lib/db'

export async function DELETE(req: Request) {

    const url = new URL(req.url);
    const commentId = url.searchParams.get('id'); 
  
    if (!commentId) {
      return new Response(
        'Comment ID is required',
        { status: 400 }
      );
    }
  
    try {
    
      const deleteCommentAndReplies = async (commentId: string) => {
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
    
      await deleteCommentAndReplies(commentId);

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