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
  const [finishedTodoList, setFinishedTodoList] = useState(0)
  const [unfinishedTodoList, setUnfinishedTodoList] = useState(0)
  const [newTodoList, setNewTodoList] = useState("")
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
  }, [unfinishedTodoList, finishedTodoList])

  // Get todo list from server
  const getTodosList = async () => {
    const getList = await axios.get(`${VITE_APP_HOST}/todos`, header)

    console.log("todoList:", getList.data.data.length)

    if (getList.data.data.length > 0) {
      setIsTodoListEmpty(false)

      // Get total number of un finished todo list
      setUnfinishedTodoList(
        getList.data.data.filter((item) => item.status === false).length
      )

      // Get todo list
      setTodoList(getList.data.data)
      console.log("todoList:", todoList)
    } else {
      setIsTodoListEmpty(true)
    }
  }

  // Add new todo list item
  const addNewTodoItem = async (e) => {
    e.preventDefault()
    const newItem = addTodoItemRef.current.value
    console.log("newItem:", newItem)

    try {
      const response = await axios.post(
        `${VITE_APP_HOST}/todos`,
        { content: newItem },
        header
      )

      if (response.status == 201) {
        Swal.fire({
          icon: "success",
          title: "新增成功",
          text: "已成功新增待辦事項",
          timer: 2000,
          timerProgressBar: false,
        })
        // setNewTodoList(newItem)
        addTodoItemRef.current.value = ""
        getTodosList()
        console.log("response:", response.data)
      }
    } catch (error) {
      console.log("error:", error.response.data)
      Swal.fire({
        icon: "error",
        title: "新增失敗",
        text: "待辦事項不可為空，請重新輸入",
        timer: 2000,
        confirmButtonText: "確認",
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
      console.log("error:", error.response.data)
      Swal.fire({
        icon: "error",
        title: "登入失敗",
        text: "您尚未登入，請返回首頁後重新登入使用！",
        timer: 2000,
        confirmButtonText: "確認",
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
        title: "登出失敗",
        text: "您尚未登入，請返回首頁後重新登入使用！",
        timer: 2000,
        confirmButtonText: "確認",
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
          title: "登出成功",
          text: "歡迎下次再來",
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
        title: "登出失敗",
        text: error.response.data,
        confirmButtonText: "確認",
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
      case "全部":
        return todoList
      case "待完成":
        return todoList.filter((item) => item.status === false)
      case "已完成":
        return todoList.filter((item) => item.status === true)
      default:
        return todoList
    }
  }, [toggleState, todoList])

  // Toggle todo list status
  const toggleStatus = async (id) => {
    await axios.patch(`${VITE_APP_HOST}/todos/${id}/toggle`, {}, header)
    getTodosList()
  }

  // Clear finished todo list items
  const handleClearFininshedItems = async (e) => {
    e.preventDefault()
    const doneTodos = todoList.filter((item) => item.status === true)
    doneTodos.map(async (item) => {
      await axios.delete(`${VITE_APP_HOST}/todos/${item.id}`, header)
    })

    getTodosList()
    setTimeout(() => {
      setToggleState("全部")
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
                <span>{nickName}的代辦</span>
              </a>
            </li>
            <li>
              <a href='#' onClick={handleLogout}>
                登出
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
                placeholder='請輸入待辦事項'
              />
              <a href='' onClick={addNewTodoItem}>
                <FontAwesomeIcon className='icon-plus' icon={faPlus} />
              </a>
            </div>
            {isTodoListEmpty ? (
              /* 顯示無待辦事項 */
              <div className='empty_container'>
                <div className='empty_text'>
                  <h2 className='text'>目前尚無代辦事項</h2>
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
                      className={toggleState === "全部" ? "active" : ""}
                      onClick={switchTodoListStatus}>
                      全部
                    </a>
                  </li>
                  <li>
                    <a
                      href=''
                      className={toggleState === "待完成" ? "active" : ""}
                      onClick={switchTodoListStatus}>
                      待完成
                    </a>
                  </li>
                  <li>
                    <a
                      href=''
                      className={toggleState === "已完成" ? "active" : ""}
                      onClick={switchTodoListStatus}>
                      已完成
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
                              // value='true'
                              // defaultChecked={item.status}
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
                    <p>{unfinishedTodoList} 個待完成項目</p>
                    <a href='#' onClick={handleClearFininshedItems}>
                      清除已完成項目
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
