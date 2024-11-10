import { db } from '@/lib/db'
import { getAuthSession } from '@/lib/auth';

export async function GET(req) {

    const session = await getAuthSession()

    const url = new URL(req.url);  // Parse the request URL
    const chatId = url.searchParams.get('id');
    console.log(chatId)
    
    const messages = await db.message.findMany({
        where:{
            chatId: chatId
        },
        orderBy: {
            timeStamp: 'asc'
        }
    })

    const chat = await db.chat.findFirst({
        where:{
            id: chatId
        }
    })

    let userDetails;
    if(chat.userId1 == session.user.id)
    {
        userDetails = await db.user.findFirst({
            where:{
                id: chat.userId2
            }
        })
    } else {
        userDetails = await db.user.findFirst({
            where:{
                id: chat.userId1
            }
        })
    }




    return new Response(JSON.stringify({status:200, messages, userDetails}))      
}

export async function POST(req) {

    const body = await req.json();
    const { message, chatId, userSentId} = body;

    
    const newMessage = await db.message.create({
        data:{
            chatId: chatId,
            text: message,
            userSentId: userSentId
        }
    })
    
    return new Response(JSON.stringify({status:200, newMessage}))      
}
