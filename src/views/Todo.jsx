import { useState, useEffect, useRef, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons"
import Swal from "sweetalert2"
import axios from "axios"

function Todo() {
  // Read environment variables
  const { VITE_APP_HOST } = import.meta.env
  const navigate = useNavigate()

  // Set state
  const [nickName, setNickName] = useState("")
  const [todoList, setTodoList] = useState([])
  const [isTodoEmpty, setIsTodoEmpty] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthToken()
  }, [])

  // Get token from cookie
  const token = document.cookie.split("=")[1]
  console.log("token:", token)

  // Check auth token and get current todo list
  const handleNewTodo = () => {
    // navigate("/login")
  }

  // Check auth token
  const checkAuthToken = async () => {
    const params = {
      headers: {
        Authorization: token,
      },
    }

    try {
      const response = await axios.get(
        `${VITE_APP_HOST}/users/checkout`,
        params
      )
      if (response.status == 200) {
        setNickName(response.data.nickname)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.log(error.response.data)
      Swal.fire({
        icon: "error",
        title: "登入失敗",
        text: "請返回首頁重新登入",
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
              <input type='text' placeholder='請輸入待辦事項' />
              <a href='#' onClick={handleNewTodo}>
                <FontAwesomeIcon icon={faPlus} />
              </a>
            </div>
            <div className='todoList_list'>
              <ul className='todoList_tab'>
                <li>
                  <a href='#' className='active'>
                    全部
                  </a>
                </li>
                <li>
                  <a href='#'>待完成</a>
                </li>
                <li>
                  <a href='#'>已完成</a>
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
                      <span>打電話叫媽媽匯款給我</span>
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
                  <li>
                    <label className='todoList_label'>
                      <input
                        className='todoList_input'
                        type='checkbox'
                        value='true'
                      />
                      <span>繳電費水費瓦斯費</span>
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
                      <span>約vicky禮拜三泡溫泉</span>
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
                      <span>約ada禮拜四吃晚餐</span>
                    </label>
                    <a href='#'>
                      <i className='fa fa-times'></i>
                    </a>
                  </li>
                </ul>
                <div className='todoList_statistics'>
                  <p>5 個已完成項目</p>
                  <a href='#'>清除已完成項目</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null
}

export default Todo
