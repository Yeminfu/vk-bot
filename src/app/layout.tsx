import Link from 'next/link'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
// import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>

        <div className="d-sm-flex">
          <div className='pe-3'>
            <ul>
              <li><Link className="text-nowrap" href={"/groups/search"}>groups</Link></li>
              <li><Link className="text-nowrap" href={"/users/search"}>users.search</Link></li>
              <li><Link className="text-nowrap" href={"/users/db"}>users from db</Link></li>
            </ul>
          </div>
          <div className='flex-fill'>{children}</div>
        </div>

        <ToastContainer />
      </body>
    </html>
  )
}
