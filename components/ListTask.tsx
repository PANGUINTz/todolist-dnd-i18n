"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useDrag, useDrop } from "react-dnd";
import toast from "react-hot-toast";

interface ITask {
  id: string;
  name: string;
  status: string;
}

type CreateTaskType = {
  tasks: ITask[];
  setTasks: Dispatch<SetStateAction<ITask[]>>;
};

const ListTask = ({ tasks, setTasks }: CreateTaskType) => {
  const [todos, setTodos] = useState<ITask[]>([]);
  const [inProgress, setInProgress] = useState<ITask[]>([]);
  const [closed, setClosed] = useState<ITask[]>([]);

  useEffect(() => {
    const fTodos = tasks.filter((task) => task.status === "todo");
    const fInProgress = tasks.filter((task) => task.status === "inprogress");
    const fClosed = tasks.filter((task) => task.status === "closed");

    setTodos(fTodos);
    setInProgress(fInProgress);
    setClosed(fClosed);
  }, [tasks]);

  const status = ["todo", "inprogress", "closed"];
  return (
    <div className="flex gap-16">
      {status.map((item, index) => {
        return (
          <Section
            key={index}
            status={item}
            tasks={tasks}
            setTasks={setTasks}
            todos={todos}
            inProgress={inProgress}
            closed={closed}
          />
        );
      })}
    </div>
  );
};

export default ListTask;

type TSection = {
  status: string;
  tasks: ITask[];
  setTasks: Dispatch<SetStateAction<ITask[]>>;
  todos: ITask[];
  inProgress: ITask[];
  closed: ITask[];
};

const Section = ({
  status,
  tasks,
  setTasks,
  todos,
  inProgress,
  closed,
}: TSection) => {
  const addItemToSection = (id: string) => {
    setTasks((prev) => {
      const newTasks = prev.map((t) => {
        if (t.id == id) {
          return { ...t, status: status };
        }
        return t;
      });
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return newTasks;
    });
    toast.success("move success");
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: ITask) => addItemToSection(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  let text = "todos";
  let bg = "bg-slate-500";
  let task = todos;

  if (status === "inprogress") {
    text = "inprogress";
    bg = "bg-purple-500";
    task = inProgress;
  }

  if (status === "closed") {
    text = "closed";
    bg = "bg-green-500";
    task = closed;
  }

  return drop(
    <div className={`w-64 rounded-md p-2 ${isOver && "bg-slate-200"}`}>
      <Header text={text} bg={bg} count={task.length} />

      {task.length > 0 &&
        task.map((item) => (
          <Task key={item.id} task={item} tasks={tasks} setTasks={setTasks} />
        ))}
    </div>
  );
};

const Header = ({
  text,
  bg,
  count,
}: {
  text: string;
  bg: string;
  count: number;
}) => {
  const t = useTranslations("Title");
  return (
    <div
      className={`${bg} flex items-center h-12 pl-4 rounded-md uppercase text-white text-sm`}
    >
      {t(`${text}`)}
      <div className="ml-2 bg-white  w-5 h-5 text-black rounded-full flex items-center justify-center">
        {count}
      </div>
    </div>
  );
};

const Task = ({
  task,
  tasks,
  setTasks,
}: {
  task: ITask;
  tasks: ITask[];
  setTasks: Dispatch<SetStateAction<ITask[]>>;
}) => {
  const onRemove = (id: string) => {
    const fTasks = tasks.filter((t) => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(fTasks));
    setTasks(fTasks);
    toast.success("remove success");
  };

  const [{ isDagging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDagging: !!monitor.isDragging(),
    }),
  }));

  return drag(
    <div
      className={`relative p-4 mt-8 shadow-md rounded-md cursor-grab ${
        isDagging ? "opacity-25" : "opacity-100"
      }`}
    >
      <p>{task.name}</p>
      <button
        className="absolute bottom-1 right-1  text-slate-400"
        onClick={() => onRemove(task.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </div>
  );
};
