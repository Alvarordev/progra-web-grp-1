import './App.css'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Topics from './components/Topics.jsx'
import Deadlines from './components/Deadlines.jsx'
import Criteria from './components/Criteria.jsx'
import Footer from './components/Footer.jsx'
function App() {
  return (
    <>
    <Header />
    <Hero />
    <Topics />
    <div className="infoGrid">
      <Deadlines />
      <Criteria />
    </div> 
    <Footer />
    </>
  )
}

export default App