import { db } from '@/lib/db'
import { getAuthSession } from '@/lib/auth'

export async function POST(req) {

    const body = await req.json();
    const { username } = body;

    const session = await getAuthSession()
    
    if (session) {
        const user = await db.user.findFirst({
          where: {
            username: username
          }
        })
        const existingChat = await db.chat.findFirst({
            where: {
              OR: [
                { userId1: session.user.id, userId2: user.id },
                { userId1: user.id, userId2: session.user.id },
              ],
            },
          });
      
          if (existingChat) {
            return new Response(JSON.stringify({ status: 200, chat: existingChat }), { status: 200 });
          }
      
          const newChat = await db.chat.create({
            data: {
              userId1: session.user.id,
              userId2: user.id,
            },
          });
      
          return new Response(JSON.stringify({ status: 200, chat: newChat }), { status: 200 });
      }
    
    return new Response({status:500})
      
}
