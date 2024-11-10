import { db } from '@/lib/db'
import { getAuthSession } from '@/lib/auth'

export async function GET(req) {

    const session = await getAuthSession()
    let ret = []
    if (session) {
        const chatList = await db.chat.findMany({
          where: {
            OR: [
              { userId1: session.user.id },
              { userId2: session.user.id }
            ]
          }
        });

        for(const chats of chatList){
          let chatDetails = {}
          let user2details;
          if(chats.userId1 === session.user.id){
            user2details = await db.user.findFirst({
              where:{
                id: chats.userId2
              }
            }) 
          } else {
            user2details = await db.user.findFirst({
              where:{
                id: chats.userId1
              }
            }) 
          }
          chatDetails['userDetails'] = user2details
          chatDetails['id'] = chats.id
          ret.push(chatDetails)
        }
        

        return new Response(JSON.stringify({status:200, chatList:ret, myDetails: session.user}))
      }
    
      return new Response({status:500})
      
}
