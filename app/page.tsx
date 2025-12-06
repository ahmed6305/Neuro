import React from 'react'
import Link from 'next/link'
import { games } from '../lib/mockData'
import HomeClient from '../components/HomeClient'

export default function Home(){
  return (
    <HomeClient games={games} />
  )
}
