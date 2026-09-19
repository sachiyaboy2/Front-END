import { Routes, Route } from 'react-router-dom';

export default function AdminPage() {

  return (
    <div className='w-full h-full bg-primary flex p-1'> 
      <div className='w-[300px] h-full bg-primary'> 
 
      </div>
      <div className='w-[calc(100%-300px)] h-full bg-primary border-3 border-accent rounded-[20px] p-2'> 
          <Routes path="/"> 
            <Route path='/' element={<h1>Admin Board</h1>}/>
            <Route path="/dashboard" element={<div>Dashboard</div>} /> 
            <Route path="/products" element={<div>Products</div>} />
            <Route path="/orders" element={<div>Orders</div>} />
            <Route path="/users" element={<div>Users</div>} />    
          </Routes>
      </div>
    </div>
  );
} 