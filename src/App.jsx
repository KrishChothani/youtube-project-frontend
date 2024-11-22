import { useEffect, useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './Components/Header/Header'
import Left_Header from './Components/Left_Header/Left_Header'

function App() {
  return (
    <>
    
      <div className="h-screen overflow-y-auto bg-[#121212] text-white">
        <Header />
        <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <Left_Header />
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App
