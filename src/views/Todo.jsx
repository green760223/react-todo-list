import { useState, useEffect, useRef, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons"
import Swal from "sweetalert2"
import axios from "axios"
import empty from "../images/empty.png"

function Todo() {
  // Read environment variables
  const { VITE_APP_HOST } = import.meta.env
  const navigate = useNavigate()

  // Set state
  const addTodoItemRef = useRef()
  const [nickName, setNickName] = useState("")
  const [todoList, setTodoList] = useState([])
  // const [finishedTodoList, setFinishedTodoList] = useState(0)
  const [unfinishedTodoList, setUnfinishedTodoList] = useState(0)
  const [isTodoListEmpty, setIsTodoListEmpty] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [toggleState, setToggleState] = useState("全部")

  // Get token from cookie
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1]

  // Set header
  const header = {
    headers: {
      Authorization: token,
    },
  }

  // Fetch todo list from server when component mounted and token is valid
  useEffect(() => {
    checkAuthToken(), getTodosList()
    console.log("useEffct:", useEffect)
  }, [])

  // Get todo list from server
  const getTodosList = async () => {
    const getList = await axios.get(`${VITE_APP_HOST}/todos`, header)

    if (getList.data.data.length > 0) {
      setIsTodoListEmpty(false)

      // Get total number of un finished todo list
      setUnfinishedTodoList(
        getList.data.data.filter((item) => item.status === false).length
      )

      // Get todo list
      setTodoList(getList.data.data)
    } else {
      setIsTodoListEmpty(true)
    }
  }

  // Add new todo list item
  const addNewTodoItem = async (e) => {
    e.preventDefault()
    const newItem = addTodoItemRef.current.value

    try {
      const response = await axios.post(
        `${VITE_APP_HOST}/todos`,
        { content: newItem },
        header
      )

      if (response.status == 201) {
        Swal.fire({
          icon: "success",
          title: "Successfully added",
          text: "A to-do item has successfully added",
          timer: 2000,
          timerProgressBar: false,
        })

        addTodoItemRef.current.value = ""
        getTodosList()
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to add",
        text: "The to-do item cannot be empty!",
        timer: 2000,
        confirmButtonText: "Confirm",
      })
    }
  }

  // Check auth token and get nickname
  const checkAuthToken = async () => {
    try {
      const response = await axios.get(
        `${VITE_APP_HOST}/users/checkout`,
        header
      )
      if (response.status == 200) {
        setNickName(response.data.nickname)
        setIsAuthenticated(true)
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: "Not logged in. Please return to the homepage and log in！",
        timer: 2000,
        confirmButtonText: "Confirm",
      })

      setTimeout(() => {
        navigate("/")
      }, 2000)
    }
  }

  // Logout function
  const handleLogout = async () => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Logout failed",
        text: "Not logged in. Please return to the homepage and log in!",
        timer: 2000,
        confirmButtonText: "Confirm",
      })
      return
    }

    try {
      const response = await axios.post(
        `${VITE_APP_HOST}/users/sign_out`,
        {},
        header
      )
      if (response.status == 200) {
        Swal.fire({
          icon: "success",
          title: "Logout successful",
          text: "We look forward to welcoming you back!",
          timer: 2000,
          timerProgressBar: false,
        })
        setIsAuthenticated(false)
        setTimeout(() => {
          navigate("/")
        }, 2000)
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Logout failed",
        text: error.response.data,
        confirmButtonText: "Confirm",
      })
    }
  }

  // Swtich todo list status for tabs
  const switchTodoListStatus = (e) => {
    e.preventDefault()
    setToggleState(e.target.textContent)
  }

  // Delete todo list item
  const handleDeleteItem = async (id) => {
    console.log("id:", id)
    const deteleItem = await axios.delete(
      `${VITE_APP_HOST}/todos/${id}`,
      header
    )
    getTodosList()
  }

  // tab switch function for todo list
  const todoStateSwitch = useMemo(() => {
    switch (toggleState) {
      case "All":
        return todoList
      case "Incomplete":
        return todoList.filter((item) => item.status === false)
      case "Completed":
        return todoList.filter((item) => item.status === true)
      default:
        return todoList
    }
  }, [toggleState, todoList])

  // Toggle todo list status
  const toggleStatus = async (id) => {
    const url = await axios.patch(
      `${VITE_APP_HOST}/todos/${id}/toggle`,
      {},
      header
    )

    getTodosList()
  }

  // Clear finished todo list items
  const handleClearFininshedItems = async (e) => {
    e.preventDefault()
    const doneTodos = todoList.filter((item) => item.status === true)
    doneTodos.map(async (item) => {
      await axios.delete(`${VITE_APP_HOST}/todos/${item.id}`, header)
    })

    setTimeout(() => {
      setToggleState("All")
      getTodosList()
    }, 1000)
  }

  return isAuthenticated ? (
    <>
      <div id='todoListPage' className='bg-half'>
        <nav>
          <h1>
            <a href='#'>ONLINE TODO LIST</a>
          </h1>
          <ul>
            <li className='todo_sm'>
              <a href='#'>
                <span>{nickName}'s To-Do List</span>
              </a>
            </li>
            <li>
              <a href='#' onClick={handleLogout}>
                Logout
              </a>
            </li>
          </ul>
        </nav>
        <div className='conatiner todoListPage vhContainer'>
          <div className='todoList_Content'>
            <div className='inputBox'>
              <input
                type='text'
                ref={addTodoItemRef}
                placeholder='Add a new item...'
              />
              <a href='' onClick={addNewTodoItem}>
                <FontAwesomeIcon className='icon-plus' icon={faPlus} />
              </a>
            </div>
            {isTodoListEmpty ? (
              /* 顯示無待辦事項 */
              <div className='empty_container'>
                <div className='empty_text'>
                  <h2 className='text'>No current to-do items</h2>
                </div>
                <div className='empty_img'>
                  <img src={empty} alt='empty_img' />
                </div>
              </div>
            ) : (
              /* 顯示待辦清單 */
              <div className='todoList_list'>
                <ul className='todoList_tab'>
                  <li>
                    <a
                      href=''
                      className={toggleState === "All" ? "active" : ""}
                      onClick={switchTodoListStatus}>
                      All
                    </a>
                  </li>
                  <li>
                    <a
                      href=''
                      className={toggleState === "Incomplete" ? "active" : ""}
                      onClick={switchTodoListStatus}>
                      Incomplete
                    </a>
                  </li>
                  <li>
                    <a
                      href=''
                      className={toggleState === "Completed" ? "active" : ""}
                      onClick={switchTodoListStatus}>
                      Completed
                    </a>
                  </li>
                </ul>
                <div className='todoList_items'>
                  <ul className='todoList_item'>
                    {todoStateSwitch.map((item) => {
                      return (
                        <li key={item.id}>
                          <label className='todoList_label'>
                            <input
                              className='todoList_input'
                              type='checkbox'
                              value={item.status}
                              checked={item.status}
                              onChange={(e) => {
                                toggleStatus(item.id, e)
                              }}
                            />
                            <span>{item.content}</span>
                          </label>
                          <button
                            className='button_reset'
                            onClick={() => handleDeleteItem(item.id)}>
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                  <div className='todoList_statistics'>
                    <p>{unfinishedTodoList} items to be completed</p>
                    <a href='#' onClick={handleClearFininshedItems}>
                      Clear completed items
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  ) : null
}

export default Todo
