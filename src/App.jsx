import { useState } from "react"
import { Routes, Route, NavLink, HashRouter } from "react-router-dom"
import Auth from "./views/Auth.jsx"
import Todo from "./views/Todo.jsx"
import Login from "./views/Login.jsx"
import Register from "./views/Register.jsx"
import "./css/style.css"
import NotFound from "./views/NotFound.jsx"

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Auth />}>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>
        <Route path='/todo' element={<Todo />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </HashRouter>
  )
}

export default App
