import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../components/Home'
import ListingPage from '../components/ListingPage'
import DetailPage from '../components/DetailPage'

const AllRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/listing/:category' element={<ListingPage/>}/>
        <Route path='/detail/:placeId' element={<DetailPage/>}/>
    </Routes>
  )
}

export default AllRoutes