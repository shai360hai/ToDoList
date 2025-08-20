"use client";

import React, { useState } from "react";
import { Button, TextField, Card, CardContent, CardHeader, Typography, IconButton } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface Task {
  id: number;
  text: string;
  deadline: Dayjs | null;
  done: boolean;
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [deadline, setDeadline] = useState<Dayjs | null>(dayjs());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editDeadline, setEditDeadline] = useState<Dayjs | null>(null);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask,
        deadline,
        done: false,
      },
    ]);
    setNewTask("");
    setDeadline(dayjs());
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
    setEditDeadline(task.deadline);
  };

  const saveEdit = (id: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, text: editText, deadline: editDeadline } : t
      )
    );
    setEditingId(null);
    setEditText("");
    setEditDeadline(null);
  };

  const isOverdue = (task: Task) =>
    task.deadline && dayjs().isAfter(task.deadline) && !task.done;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <main className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-xl shadow-xl rounded-2xl">
          <CardHeader
            title={
              <Typography variant="h4" className="text-center font-bold">
                📅 TODO List with Deadlines
              </Typography>
            }
          />
          <CardContent>
            {/* Add Task Form */}
            <div className="flex flex-col gap-4">
              <TextField
                label="New Task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                fullWidth
              />
              <DateTimePicker
                label="Deadline"
                value={deadline}
                onChange={(newValue) => setDeadline(newValue)}
              />
              <Button variant="contained" color="primary" onClick={addTask}>
                Add Task
              </Button>
            </div>

            {/* Task List */}
            <div className="mt-6 space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg flex justify-between items-center transition-all ${
                    task.done
                      ? "bg-green-100 line-through"
                      : isOverdue(task)
                      ? "bg-red-100"
                      : "bg-white"
                  }`}
                >
                  {editingId === task.id ? (
                    <div className="flex flex-col gap-2 w-full">
                      <TextField
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        fullWidth
                      />
                      <DateTimePicker
                        label="Deadline"
                        value={editDeadline}
                        onChange={(newValue) => setEditDeadline(newValue)}
                      />
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckIcon />}
                          onClick={() => saveEdit(task.id)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<CloseIcon />}
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => toggleTask(task.id)}
                      >
                        <span>{task.text}</span>
                        {task.deadline && (
                          <div className="text-sm text-gray-600">
                            {task.deadline.format("DD/MM/YYYY HH:mm")}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-2">
                        <IconButton
                          color="primary"
                          onClick={() => startEdit(task)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => deleteTask(task.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </LocalizationProvider>
  );
}
