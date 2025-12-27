import Navbar from '@/Components/Navbar';
import React from 'react';

const Loader = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-[#121212]">
      <Navbar />
      <div className="loader ">
        <div className="loader-square" />
        <div className="loader-square" />
        <div className="loader-square" />
        <div className="loader-square" />
        <div className="loader-square" />
        <div className="loader-square" />
        <div className="loader-square" />
      </div>
    </div>
  );
}


export default Loader;
