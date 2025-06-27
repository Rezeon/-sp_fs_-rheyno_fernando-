"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ProjectTasksPage() {
  const { id: projectId } = useParams()
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('todo')
  const [assignee, setAssignee] = useState('')
  const [token, setToken] = useState('')

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token')
    if (!tokenFromStorage) return

    setToken(tokenFromStorage)
    fetch(`/api/tasks?projectId=${projectId}`, {
      headers: { Authorization: `Bearer ${tokenFromStorage}` },
    })
      .then(res => res.json())
      .then(data => setTasks(data))
  }, [projectId])

  const handleCreateTask = async () => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        projectId,
        title,
        description,
        status,
        assignee
      })
    })

    const newTask = await res.json()
    setTasks(prev => [...prev, newTask])
    setTitle('')
    setDescription('')
    setStatus('todo')
    setAssignee('')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tasks for Project {projectId}</h1>

      <div className="grid gap-2 mb-6">
        <Input
          placeholder="Task Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <Input
          placeholder="Task Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <Input
          placeholder="Assignee User ID"
          value={assignee}
          onChange={e => setAssignee(e.target.value)}
        />
        <Button onClick={handleCreateTask}>Create Task</Button>
      </div>

      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="p-4 border rounded shadow bg-white">
            <h2 className="font-semibold">{task.title}</h2>
            <p className="text-sm text-gray-600">{task.description}</p>
            <p className="text-sm mt-1">Status: {task.status}</p>
            <p className="text-sm">Assignee: {task.assignee || 'Unassigned'}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
