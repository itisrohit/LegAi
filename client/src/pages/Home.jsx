import React from 'react'
import '../../src/App.css'

const Home = () => {
  return (
    <div className="home">
      <div className='landing-page w-full h-screen p-12'>
        <h1 className='text-9xl font-extrabold my-20'>Your <br/>Personal <span className='text-purple-500'>AI</span> <br/>Legal Advisor</h1>
        <button className='rounded-md bg-white text-black font-extrabold text-xl py-3 px-10'>Login with Google</button>
      </div>
      <div className='about-us w-full h-screen m-0 p-20'>
        <h2 className='text-8xl text-center mt-20 font-extrabold my-10'>About Us</h2>
        <p className='text-3xl w-3/4 font-bold ml-40 rounded-lg leading-10 mt-30 bg-purple-200 p-8'>At LegAI, we are revolutionizing the way individuals and businesses access legal insights. Our platform harnesses the power of advanced artificial intelligence to provide accurate, timely, and cost-effective legal guidance. Whether you're seeking information on legal regulations, drafting contracts, or exploring compliance requirements, we are here to simplify the legal landscape for you.</p>
      </div>
      <div className='services w-full h-screen p-12'>
        <h2 className='text-8xl text-center mt-20 font-extrabold my-10'>Our Services</h2>
        <ul className='list-disc text-3xl w-3/4 font-bold leading-10 ml-40 mt-30 p-8 rounded-lg bg-purple-200'>
          <li>
            <p>Instant Legal Insights: Get answers to your legal queries quickly and efficiently.</p>
          </li>
          <li>
            <p>User-Friendly Interface: Our intuitive platform makes it easy to navigate complex legal topics.</p>
          </li>
          <li>
            <p>Ethical & Secure: We prioritize the confidentiality and security of your data.</p>
          </li>
        </ul>
      </div>
      
      
    </div>
  )
}

export default Home
