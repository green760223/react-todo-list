import { Routes, Route, HashRouter } from "react-router-dom"
import Auth from "./views/Auth.jsx"
import Todo from "./views/Todo.jsx"
import Login from "./views/Login.jsx"
import Register from "./views/Register.jsx"
import NotFound from "./views/NotFound.jsx"
import "./css/style.css"

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Auth />}>
          <Route index element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>
        <Route path='/todo' element={<Todo />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </HashRouter>
  )
}

export default App
