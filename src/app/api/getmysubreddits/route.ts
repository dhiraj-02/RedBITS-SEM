import { db } from '@/lib/db'
import { getAuthSession } from '@/lib/auth'

export async function GET(req: Request) {

    const session = await getAuthSession()
    let followedCommunitiesNames: string[] = []

    
    if (session) {
        const followedCommunities = await db.subscription.findMany({
          where: {
            userId: session.user.id,
          },
          include: {
            subreddit: true,
          },
        })
    
        followedCommunitiesNames = followedCommunities.map((sub) => sub.subreddit.name)
      }
    

      
    return new Response(JSON.stringify(followedCommunitiesNames))
}
