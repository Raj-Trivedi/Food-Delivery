import React, { useEffect } from 'react'
import Header from "../Component/Header/Header"
import Explore from '../Component/Explore/Explore'
import FoodDisplay from '../Component/FoodDisplay/FoodDisplay'

export const Home = () => {

  const [category, setCategory] = React.useState('All');
  return (
    <div className='Home-container'>
      <Header />
      <Explore category={category} setCategory={setCategory}/>
      <FoodDisplay category={category} />
    </div>
  )
}
