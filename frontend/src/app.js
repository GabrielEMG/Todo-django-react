import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const titleRef = useRef();
  const descriptionRef = useRef();

  const csrfToken = window.django.csrf;

  const user = window.django.user.username;
  useEffect(() => {
    const getTasks = async () => {
      const url = "/api/get_tasks";
      const get = await axios.get(url);
      setTasks(get.data);
    };
    getTasks();
  }, []);

  const sendTask = async () => {
    const url = "/api/post_task";
    const data = { title, description };
    const headers = { "X-CSRFToken": csrfToken };
    const post = await axios.post(url, data, { headers });
    setTasks([...tasks, JSON.parse(post.data.task)]);
    titleRef.current.value = "";
    descriptionRef.current.value = "";
    titleRef.current.focus();
  };

  const deleteTask = async (id) => {
    const url = "/api/delete_task";
    const data = { id };
    const headers = { "X-CSRFToken": csrfToken };
    const post = await axios.post(url, data, { headers });
    if (post.data.deleted) {
      const newTasks = tasks.filter((task) => task.id != id);
      setTasks(newTasks);
    } else {
      alert("error deleting task");
    }
  };

  const completeTask = async (id) => {
    const url = "/api/complete_task";
    const data = { id };
    const headers = { "X-CSRFToken": csrfToken };
    const post = await axios.post(url, data, { headers });
    console.log(post.data.changed);
    if (post.data.changed) {
      const newTasks = tasks.map((task) => {
        if (task.id == id) {
          task.completed = !task.completed;
          return task;
        } else {
          return task;
        }
      });
      setTasks(newTasks);
    }
  };

  const taskList = tasks.map((task, id) => (
    <div
      onClick={() => completeTask(task.id)}
      key={id}
      className={
        "border container rounded mb-2 " +
        (task.completed ? "bg-success" : "bg-warning")
      }
    >
      <div className="row justify-content-end">
        <button
          className="btn btn-danger border-dark"
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
        >
          x
        </button>
      </div>
      <h4 className="row justify-content-center">{task.title}</h4>
      <p className="row justify-content-center">{task.description}</p>
    </div>
  ));

  return (
    <div className="container mt-4 bg-light rounded p-5">
      <div className="row justify-content-between">
        <h4>Username: {user}</h4>
        <h4>
          <a href="/logout">logout</a>
        </h4>
      </div>
      <div className="row justify-content-center mb-3 mt-3">
        <div className="col-11 col-md-5 col-lg-4 col-xl-3 bg-dark p-3 border rounded">
          <h3 className="row justify-content-center text-white">
            Create a task
          </h3>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            ref={titleRef}
          />
          <textarea
            type="text"
            className="form-control mb-2"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            ref={descriptionRef}
          />
          <button
            onClick={() => sendTask()}
            className="col border-dark btn btn-success"
          >
            Send task
          </button>
        </div>
      </div>
      <div>{taskList}</div>
    </div>
  );
};

export default App;
