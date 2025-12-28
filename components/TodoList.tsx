
import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Trash2, CheckCircle2, Circle, ListPlus } from 'lucide-react';

interface TodoListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const TodoList: React.FC<TodoListProps> = ({ tasks, setTasks }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newTotal, setNewTotal] = useState(10);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTitle,
      totalQuestions: newTotal,
      completedQuestions: 0,
      completed: false,
      createdAt: Date.now()
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setNewTotal(10);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const updateQuestions = (id: string, increment: number) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const newVal = Math.max(0, Math.min(t.totalQuestions, t.completedQuestions + increment));
        return { ...t, completedQuestions: newVal, completed: newVal === t.totalQuestions };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <ListPlus className="text-indigo-400" />
        <h2 className="text-xl font-bold">Blocos de Questões</h2>
      </div>

      <form onSubmit={addTask} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
        <input 
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="Ex: Matemática - Logaritmos"
          className="md:col-span-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input 
          type="number"
          value={newTotal}
          onChange={e => setNewTotal(parseInt(e.target.value))}
          placeholder="Qtd"
          className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button 
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors text-white rounded-xl px-4 py-2 font-bold flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus size={20} /> Add
        </button>
      </form>

      <div className="flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/20">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-white/40 text-center italic">
            <p>Nenhum bloco de questões adicionado.</p>
            <p className="text-sm">Comece planejando seus estudos!</p>
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id}
              className={`group flex items-center justify-between p-4 rounded-2xl transition-all border ${task.completed ? 'bg-indigo-900/20 border-indigo-500/30 opacity-70' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              <div className="flex items-center gap-4 flex-grow">
                <button onClick={() => toggleTask(task.id)} className="text-indigo-400 hover:text-indigo-300">
                  {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <div className="flex-grow">
                  <h4 className={`font-semibold text-sm md:text-base ${task.completed ? 'line-through text-white/50' : 'text-white'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-24 bg-white/10 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full transition-all duration-300" 
                        style={{ width: `${(task.completedQuestions / task.totalQuestions) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-white/50 font-mono">
                      {task.completedQuestions}/{task.totalQuestions} questões
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-white/5 rounded-lg border border-white/10 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => updateQuestions(task.id, -1)}
                    className="px-2 py-1 hover:bg-white/10 text-white/60 transition-colors"
                  >-</button>
                  <button 
                    onClick={() => updateQuestions(task.id, 1)}
                    className="px-2 py-1 hover:bg-white/10 text-white/60 transition-colors border-l border-white/10"
                  >+</button>
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-white/20 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
