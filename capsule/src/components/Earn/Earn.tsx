import { useState, useEffect } from 'react';
import axios from 'axios';
import './earn.scss';

interface Task {
    id: number;
    name: string;
    reward: string;
    active: boolean;
    link: string;
    ready: boolean;
}

export const Earn = () => {
    const [userData, setUserData] = useState<any>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
        }
    }, []);

    useEffect(() => {
        if (userData && userData.id) {
            fetchTasks(userData.id.toString());
        }
    }, [userData]);

    const fetchTasks = async (telegramUserId: string) => {
        try {
            const response = await axios.get(`https://nutty-dominique-webapp-6a709ce4.koyeb.app/api/task/${telegramUserId}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке списка задач:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoButtonClick = async (taskId: number, taskLink: string) => {
        window.location.href = taskLink;
        try {
            await axios.post(`https://nutty-dominique-webapp-6a709ce4.koyeb.app/api/task/${userData.id}/${taskId}/complete`);
            fetchTasks(userData.id.toString());
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    };

    if (loading) {
        return <div></div>;
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
                        {!task.active || task.ready ? null : <button className='default-button' onClick={() => handleGoButtonClick(task.id, task.link)}>Go</button>}
                    </div>
                </div>
            ))}
        </div>
    );
};