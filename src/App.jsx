import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ProductCard from './components/productCard' 
import AdminPage from './pages/adminPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/homePage.jsx'
import TestPage from './pages/test.jsx'

function App() {
  

  return (
   <BrowserRouter>  
     <div className='w-full h-[100vh] bg-slate-500'> 
          <Routes path="/">
             <Route path='/*' element={<HomePage/>}/>
             <Route path='/register' element={<RegisterPage/>}/>   
             <Route path='/admin/*' element={<AdminPage/>}/>  
             <Route path='/login' element={<LoginPage/>}/>  
             <Route path='/test' element={<TestPage/>}/>  
             <Route path='/*' element={<h1>404 Page Not Found</h1>}/>

          </Routes> 
     </div>
   </BrowserRouter>
  ) 
}

export default App 


