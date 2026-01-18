import React from 'react';

const TaskItem = ({ task, onEdit, onDelete }) => {
  return (
    <li>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Completed: {task.completed ? 'Yes' : 'No'}</p>
      <button onClick={() => onEdit(task)}>Edit</button>
      <button onClick={() => onDelete(task._id)}>Delete</button>
    </li>
  );
};

export default TaskItem;
