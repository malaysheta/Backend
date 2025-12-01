import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
function App() {
  const [joke, setjoke] = useState([])

  useEffect(() => {
    axios.get('/api/jokes')
      .then((response) => {
        setjoke(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching jokes:', error)
      })
  }, [])

  return (
    <>
      <h3>Jokes api trial</h3>
      <h3>Jokes : {joke.length}</h3>

      {joke.map((item,index) => (
        <div key={item.id}>
          <h3>{item.title}</h3>
           <p>{item.joke}</p>
        </div>
      ))}
      
    </>
  )
}

export default App
