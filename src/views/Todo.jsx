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
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1]

  // Fetch todo list from server when component mounted and token is valid
  useEffect(() => {
    checkAuthToken(), getTodosList()
  }, [])

  // Get todo list from server
  const getTodosList = async () => {
    const params = {
      headers: {
        Authorization: token,
      },
    }
    const getList = await axios.get(`${VITE_APP_HOST}/todos`, params)

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

  // Check auth token and get current todo list
  const addNewTodoItem = async (e) => {
    e.preventDefault()
    const newItem = addTodoItemRef.current.value
    console.log("newItem:", newItem)

    const params = {
      headers: {
        Authorization: token,
      },
    }

    try {
      const response = await axios.post(
        `${VITE_APP_HOST}/todos`,
        { content: newItem },
        params
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
        // getTodosList()
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
      const params = {
        headers: {
          Authorization: token,
        },
      }
      const response = await axios.get(
        `${VITE_APP_HOST}/users/checkout`,
        params
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

    const params = {
      headers: {
        Authorization: token,
      },
    }

    try {
      const response = await axios.post(
        `${VITE_APP_HOST}/users/sign_out`,
        {},
        params
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
                    <li>
                      <label className='todoList_label'>
                        <input
                          className='todoList_input'
                          type='checkbox'
                          value='true'
                        />
                        <span>把冰箱發霉的檸檬拿去丟</span>
                      </label>
                      <a href='#'>
                        <i className='fa fa-times'></i>
                      </a>
                    </li>
                    <li>
                      <label className='todoList_label'>
                        <input
                          className='todoList_input'
                          type='checkbox'
                          value='true'
                        />
                        <span>整理電腦資料夾</span>
                      </label>
                      <a href='#'>
                        <i className='fa fa-times'></i>
                      </a>
                    </li>
                  </ul>
                  <div className='todoList_statistics'>
                    <p>{unfinishedTodoList} 個待完成項目</p>
                    <a href='#'>清除已完成項目</a>
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
