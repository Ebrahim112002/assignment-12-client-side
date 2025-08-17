import React from 'react';
import Banner from '../Components/Banner/Banner';
import HowItWorks from '../Components/Howitworks/HowItWorks';
import Premium_members from '../Components/Biodatas/Premium_members/Premium_members';
import Success_counter from '../Components/Biodatas/Success_counter/Success_counter';

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <Premium_members></Premium_members>
      <HowItWorks></HowItWorks>
      <Success_counter></Success_counter>
    </div>
  );
};

export default Home;