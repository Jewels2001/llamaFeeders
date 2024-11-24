import React from "react";

const TaskList: React.FC = () => {
  const tasks = [
    "Task 1: Prompt-based Post Generation",
    "Task 2: React Setup Guide",
  ];

  return (
    <div className="fixed top-1/4 left-0 transform -translate-x-0 bg-gray-800 text-white rounded-lg shadow-lg p-4 w-64">
      <h2 className="text-lg font-bold mb-2">Task List</h2>
      <ul className="list-disc pl-4 space-y-2">
        {tasks.map((task, index) => (
          <li key={index} className="text-sm">{task}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
