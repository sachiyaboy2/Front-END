import { Route, Routes } from "react-router-dom";
import Header from "../components/header";

export default function HomePage(){
    return(
        <div className="w-full h-full bg-primary"> 
        <div className="relative ">  
             <Header/>              
        </div> 
        <div>  
            <Routes path="/">
               <Route path="/" element={<h1>Wellcome to Nari Craft</h1>}/> 
               <Route path="/products" element={<h1>Products Page</h1>}/>  
               <Route path="/orders" element={<h1>Orders Page</h1>}/>  
               <Route path="/about" element={<h1>About Page</h1>}/> 
               <Route path="/*" element={<h1>404 Page Not Found</h1>}/>                    
             </Routes>
        </div>
        </div>
    )
}