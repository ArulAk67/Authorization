
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Username from './components/Username';
import Register from './components/Register';
import Profile from './components/Profile';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import PageNotFound from './components/PageNotFound';
import Password from './components/Password';
import { AuthorizeUser, ProtectRoute } from './middleware/auth';

const router =createBrowserRouter([
  {
    path:'/',
    element:<Username/>
  },
  {
    path:'/register',
    element:<div><Register/></div>
  },
  {
    path : '/password',
    element : <ProtectRoute><Password/></ProtectRoute> 
},
{
    path : '/profile',
    element : <AuthorizeUser><Profile/></AuthorizeUser>
},
{
    path : '/recovery',
    element : <Recovery/>
},
{
    path : '/reset',
    element : <Reset/>
},
{
    path : '*',
    element : <PageNotFound/>
},
])

function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}

export default App;
