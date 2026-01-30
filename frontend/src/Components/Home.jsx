import React from "react"
import { TfiHome } from "react-icons/tfi"
import { useNavigate } from "react-router"

const Home = () => {
  const navigate = useNavigate()
  const handleHome = () => {
    navigate("/dashboard")
  }
  return (
    <div 
    onClick={handleHome}
    className="fixed bottom-5 right-5 px-1 py-2 flex rounded border border-gray-400 z-10 bg-white cursor-pointer hover:bg-gray-200 "
    >
        <TfiHome size={25}/>        
    </div>
  )  
}

export default Home
