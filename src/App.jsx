import './App.css'
import LandingPage from './pages/Landingpage'
import Header from './components/Header';
import './index.css';

function App() {
  

  return (
      <>
      <Header/>
      <div className='min-h-screen'>
        <LandingPage/>
      </div>
      </>
    
  );
}

export default App
