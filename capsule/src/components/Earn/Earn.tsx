import { useState, useEffect } from 'react';
import './earn.scss';

interface Task {
    id: number;
    name: string;
    reward: string;
    active: boolean;
    ready: boolean;
}

export const Earn = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('https://elaborate-gabriel-webapp-091be922.koyeb.app/api/task/987654321');
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке списка задач');
                }
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='tasks'>
            {tasks.map(task => (
                <div key={task.id} className={`task ${!task.active || task.ready ? 'task-completed' : ''}`}>
                    <div className='task-name'>
                        {task.name}
                    </div>
                    <div className='task-reward'>
                        {task.reward}
                    </div>
                    <div className='task-start'>
                        {!task.active || task.ready ? null : <button className='default-button'>Go</button>}
                    </div>
                </div>
            ))}
        </div>
    );
};
