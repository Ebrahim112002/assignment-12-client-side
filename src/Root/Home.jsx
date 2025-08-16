import React from 'react';
import Banner from '../Components/Banner/Banner';
import HowItWorks from '../Components/Howitworks/HowItWorks';
import Premium_members from '../Components/Biodatas/Premium_members/Premium_members';

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <Premium_members></Premium_members>
      <HowItWorks></HowItWorks>
    </div>
  );
};

export default Home;