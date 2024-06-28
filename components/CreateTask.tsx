"use client";

import { useState, SetStateAction, Dispatch, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

interface ITask {
  id: string;
  name: string;
  status: string;
}

type CreateTaskType = {
  tasks: ITask[];
  setTasks: Dispatch<SetStateAction<ITask[]>>;
};

const CreateTask = ({ tasks, setTasks }: CreateTaskType) => {
  const [task, setTask] = useState({
    id: "",
    name: "",
    status: "todo",
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (task.name.length < 1)
      return toast.error("task is must have more 3 characters");

    setTasks((prev: any) => {
      const list = [...prev, task];
      localStorage.setItem("tasks", JSON.stringify(list));
      return list;
    });
    toast.success("create task success");
  };

  const t = useTranslations("Title");

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="border-2 border-slate-400 bg-slate-100 rounded-md mr-4 h-12 w-64 px-1"
          value={task.name}
          onChange={(e) =>
            setTask({ ...task, id: uuidv4(), name: e.target.value })
          }
        />
        <button className="bg-cyan-500 rounded-md px-4 h-12 text-white hover:bg-cyan-700">
          {t("create")}
        </button>
      </form>
    </>
  );
};

export default CreateTask;
