import React from 'react';
import logo from '../assets/wedding-rings.png'


const Logo = () => {
  return (
    <div className='flex gap-4 items-center'>
      <img src={logo} alt="" className='size-10 ' />
      <p className='font-playfair text-[#D81B60] text-lg font-bold'>Love Matrimony</p>
    </div>
  );
};

export default Logo;