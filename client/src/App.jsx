import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Chat from './pages/Chat'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Chat />
  },
  {
    path: '/login',
    element: <Login />
  },

])
function App() {
  

  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
