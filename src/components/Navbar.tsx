import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { Icons } from './Icons'
import { buttonVariants } from './ui/Button'
import { UserAccountNav } from './UserAccountNav'
import SearchBar from './SearchBar'

const Navbar = async () => {
  const session = await getServerSession(authOptions)
  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2'>
      <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
        {/* logo */}
        <Link href='/' className='flex gap-2 items-center'>
          <img src='/bitslogo.png' className="h-15 w-auto sm:h-10" />
          <p className='hidden text-zinc-700 text-sm font-medium md:block'>RedBITS</p>
        </Link>

        {/* search bar */}
        <SearchBar />
        <Link href='/r/chat' className='flex gap-2 items-center'>
          <Icons.chat className='h-12 w-auto sm:h-10'/>
          <p className='hidden text-zinc-700 text-sm font-medium md:block'>Chat</p>
        </Link>

        {/* actions */}
        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href='/sign-in' className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  )
}

export default Navbar
