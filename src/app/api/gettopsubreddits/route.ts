import { db } from '@/lib/db'

export async function GET(req: Request) {
  
    let ret = [];

    const results = await db.subscription.groupBy({
        by: ['subredditId'],
        orderBy: {
          _count: {
            userId: 'desc',
          },
        },
        take: 5
      });

      for( let i=0; i<results.length; i++){
        const id = results[i].subredditId;
        const subreddit = await db.subreddit.findFirst({
            where: {
                id: id
            }
        })
        ret.push(subreddit?.name)
      }
      
    return new Response(JSON.stringify(ret))
}
