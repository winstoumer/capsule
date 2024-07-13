import { useState, useEffect } from 'react';
import axios from 'axios';
import './earn.scss';
import EarnInfo from '../EarnInfo/EarnInfo';
import ButtonArrow from '../Default/ButtonArrow';
//import Loading from '../Loading/Loading';

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
    const [totalReward, setTotalReward] = useState<number>(0);

    const apiUrl = import.meta.env.VITE_API_URL;

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

    useEffect(() => {
        // Calculate the total reward of completed tasks
        const completedReward = tasks
            .filter(task => !task.active || task.ready)
            .reduce((sum, task) => sum + parseFloat(task.reward), 0);
        setTotalReward(completedReward);
    }, [tasks]);

    const fetchTasks = async (telegramUserId: string) => {
        try {
            const response = await axios.get(`${apiUrl}/api/task/${telegramUserId}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке списка задач:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = async (taskId: number, taskLink: string, taskReward: number) => {
        window.location.href = taskLink;
        try {
            await axios.post(`${apiUrl}/api/task/${userData.id}/${taskId}/complete`);
            await axios.put(`${apiUrl}/api/balance/plus/${userData.id}`, { amount: taskReward });
            fetchTasks(userData.id.toString());
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    };

    if (loading) {
        return <div></div>;
    }

    const Completed = () => (
        <span className='arrow-button'>
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M5 12L10 17L19 8"
                    stroke="white"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </span>
    );

    return (
        <div className='tasks'>
            <EarnInfo totalReward={totalReward} icon="💸" />
            {tasks.map(task => (
                <div key={task.id} className={`task ${!task.active || task.ready ? 'task-completed' : ''}`}>
                    <div className='task-info'>
                        <div className='task-name'>
                            {task.name}
                        </div>
                        <div className='task-reward'>
                            +{task.reward} P
                        </div>
                    </div>
                    {!task.active || task.ready ?
                        <Completed /> :
                        <div className='task-start'>
                            <ButtonArrow arrowType='next' onClick={() => handleClick(task.id, task.link, Number(task.reward))} />
                        </div>
                    }
                </div>
            ))}
        </div>
    );
};
