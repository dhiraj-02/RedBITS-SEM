'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'


const TopSubreddits = () => {

  const [top, setTop] = useState([])
  const [msg, setMsg] = useState('Loading...')

  const fetchData = async () => {
    const topSubreddits = await axios.get(`/api/gettopsubreddits`)
    setTop(topSubreddits.data)
    if(top.length == 0) setMsg('No communities found')
  }
  
  useEffect(() => {
    fetchData();
  },[])

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="font-bold text-xl mb-6">Top Communities</h2> {/* Increased font size for the header */}
      <ul className="space-y-2"> {/* Increased the space between items */}
        {top.length > 0 ? (
          top.map((name) => (
            <li key={name} className="text-gray-900 space-y-3"> {/* Increased height between items */}
              <a href={`/r/${name}`} className="text-xl hover:text-blue-500 transition-colors duration-300"> {/* Increased font size */}
                r/{name}
              </a>
            </li>
          ))
        ) : (
          <li className="text-gray-500">{msg}</li>
        )}
      </ul>
    </div>

  )
}

export default TopSubreddits