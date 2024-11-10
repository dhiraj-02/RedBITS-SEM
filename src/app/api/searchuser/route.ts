import { db } from '@/lib/db'
import { getAuthSession } from '@/lib/auth'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q')

  const session = await getAuthSession()

  if (!q) return new Response('Invalid query', { status: 400 })

  const results = await db.user.findMany({
    where: {
      username: {
        not: session?.user.username,
        startsWith: q
      },
    },
    include: {
      _count: true,
    },
    take: 5,
  })

  return new Response(JSON.stringify(results))
}
