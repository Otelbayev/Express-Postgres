import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchTodos = async () => {
    try {
      const res = await axios.get("/api/todo");
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) return;

    try {
      if (editingId) {
        await axios.put(`/api/todo/${editingId}`, {
          description,
          completed: false,
        });
        setEditingId(null);
      } else {
        await axios.post("/api/todo", {
          description,
          completed: false,
        });
      }

      setDescription("");
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/todo/${id}`);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (todo) => {
    setDescription(todo.description);
    setEditingId(todo.todo_id);
  };

  const toggleComplete = async (todo) => {
    try {
      await axios.put(`/api/todo/${todo.todo_id}`, {
        description: todo.description,
        completed: !todo.completed,
      });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 to-purple-200 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          Todo App
        </h1>

        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter todo..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            {editingId ? "Update" : "Add"}
          </button>
        </form>

        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.todo_id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div
                onClick={() => toggleComplete(todo)}
                className={`cursor-pointer flex-1 ${
                  todo.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {todo.description}
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(todo)}
                  className="px-3 py-1 text-sm bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(todo.todo_id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {todos.length === 0 && (
            <p className="text-center text-gray-400 mt-4">No todos yet...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
