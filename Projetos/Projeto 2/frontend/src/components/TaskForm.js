import React, { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, initialTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setCompleted(initialTask.completed);
    }
  }, [initialTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, completed });
    setTitle('');
    setDescription('');
    setCompleted(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <label>
        Completed:
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
      </label>
      <button type="submit">{initialTask ? 'Update Task' : 'Add Task'}</button>
    </form>
  );
};

export default TaskForm;
