// Home.tsx
// This page imports its own Home.css — that's the ONLY css import in this file.
// Navbar styles come from index.css (loaded globally in main.tsx)

import './Home.css'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import About from '../components/About'

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Stats />
      <About />
    </div>
  )
}

export default Home