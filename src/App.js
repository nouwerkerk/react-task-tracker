import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

function App() {
  const [showForm, setShowForm] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  //Fetch data from server
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks")
    const data = await res.json()

    return data
  }

  //Fetch task from server
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    return data
  }

  //Add task
  const addTask = async (task) => {

    const res = await fetch(`http://localhost:5000/tasks`, { 
      method: `POST`,
      headers: { 'Content-type': 'application/json'},
      body: JSON.stringify(task)
    })

    setTasks([...tasks, await res.json()])
  }

  //Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: `DELETE`})
    console.log(id)
    setTasks(tasks.filter((task) => task.id !== id))
    console.log(window.location.pathname)
  }

  //Toggle reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`, { 
      method: `PUT`,
      headers: { 'Content-type': 'application/json'},
      body: JSON.stringify(updatedTask)
    })

    const data = await res.json()
    setTasks(tasks.map((task) => task.id === id ? {...task, reminder: data.reminder} : task))
  }

  //Toggle form
  const toggleForm = () => {
    setShowForm(!showForm)
  }

  return (
    <Router>
      <div className="container">
        <Header title='Task Tracker' onShow={toggleForm} showForm={showForm}></Header>
        <Routes>
          <Route path='/' element={
            <>
              {showForm && <AddTask onAdd={addTask} ></AddTask>}
              {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}></Tasks> : "No Tasks To Show"}
            </>
            }/>
          <Route path='/about' element={<About />} />
        </Routes>
        <>
          {<Footer></Footer>}
        </>
      </div>
    </Router>
  );
}

export default App;
