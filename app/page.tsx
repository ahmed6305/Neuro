import React from 'react'
import Link from 'next/link'
import { games } from '../lib/mockData'
import HomeClient from '../components/HomeClient'
import QuickStart from '../components/QuickStart'

export default function Home() {
  return (
    <>
      <QuickStart />
      <div className="mt-12">
        <HomeClient games={games} />
      </div>
    </>
  )
}
