
import PropTypes from "prop-types";

function TaskCard({ 
  task = {
    task_name: "Untitled Task",
    description: "No description provided",
    required_skills: "No skills required",
    status: "pending",
  } 
}) {
  // Fallback for when task is undefined
  if (!task) {
    return <div>No task data available.</div>;
  }

  return (
    <div className="p-4 border rounded shadow">
      <h3 className="text-lg font-bold">{task.task_name}</h3>
      <p>{task.description}</p>
      <p className="text-sm text-gray-500">
        Required Skills: {task.required_skills}
      </p>
      <p
        className={`text-sm font-bold ${
          task.status === "completed" ? "text-green-500" : "text-red-500"
        }`}
      >
        {task.status}
      </p>
    </div>
  );
}

// Defining prop types for validation
TaskCard.propTypes = {
  task: PropTypes.shape({
    task_name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    required_skills: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }),
};

export default TaskCard;
