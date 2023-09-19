import { useState, useEffect } from "react";

import "./index.css";
import "font-awesome/css/font-awesome.min.css";

const API_BASE = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);

  const [popupActive, setPopupActive] = useState(false);

  const [newTodos, setNewTodos] = useState("");

  useEffect(() => {
    GetTodos();
    console.log(todos);
  }, []);

  const GetTodos = async () => {
    fetch(API_BASE + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error : ", err));
  };

  const completeTodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/complete/" + id).then((res) =>
      res.json()
    );
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }
        return todo;
      })
    );
  };

  const deleteTodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());

    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  };

  const addTodo = async (text) => {
    const data = await fetch(API_BASE + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodos,
      }),
    }).then((res) => res.json());

    setTodos([...todos, data]);
    setPopupActive(false);
    setNewTodos("");
  };

  return (
    <>
      <div className="App">
        <h1>Welcome, Ilias</h1>
        <h4>Your Tasks</h4>
        <div className="todos">
          {todos.map((todo) => (
            <div
              className={"todo " + (todo.complete ? "is-complete" : "")}
              key={todo._id}
              onClick={() => completeTodo(todo._id)}
            >
              <div className="checkbox"></div>
              <div className="text">{todo.text}</div>
              <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
                <i className="fa fa-trash"></i>
              </div>
            </div>
          ))}
        </div>
        <div className="addPopup" onClick={() => setPopupActive(true)}>
          <i className="fa fa-plus"></i>
        </div>

        {popupActive ? (
          <div className="popup">
            <div className="closePopup" onClick={() => setPopupActive(false)}>
              <i className="fa fa-close"></i>
            </div>
            <div>
              <h3>Add Task</h3>
              <input
                type="text"
                className="add-input"
                placeholder="write a task..."
                onChange={(e) => setNewTodos(e.target.value)}
                value={newTodos}
              />
              <div className="button" onClick={addTodo}>
                Create a new task
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default App;
