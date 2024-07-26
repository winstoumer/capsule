import { useState, useEffect } from 'react';
import axios from 'axios';
import './earn.scss';
import ButtonArrow from '../Default/ButtonArrow';
import { List, Item, Icon, Title, Subtitle, Right } from '../List/List';
import Loading from '../Loading/Loading';
import Progress from './Progress';
import NumericValue from '../Default/NumericValue';

interface Task {
    id: number;
    name: string;
    reward: number;
    active: boolean;
    link: string;
    ready: boolean;
    icon: string;
    required_progress?: number; // Optional, might be null or 0 in the database
    current_progress?: number; // Optional, to track current progress
}

export const Earn = () => {
    const [userData, setUserData] = useState<any>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [completedCount, setCompletedCount] = useState<number>(0);
    const [invitedCount, setInvitedCount] = useState<number>(0);

    const apiUrl = import.meta.env.VITE_API_URL;
    const INVITE_TASK_ID = 9;

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (userData && userData.id) {
                try {
                    // Fetch invited count
                    const response = await fetch(`${apiUrl}/api/referral/${userData.id}`);
                    if (!response.ok) {
                        throw new Error('Error fetching invited count');
                    }
                    const data = await response.json();
                    const count = Number(data.invitedCount);
                    if (!isNaN(count)) {
                        setInvitedCount(count);
                    } else {
                        console.error('Invalid invited count value:', data.invitedCount);
                    }

                    // Fetch tasks
                    const tasksResponse = await axios.get(`${apiUrl}/api/task/${userData.id}`);
                    const fetchedTasks = tasksResponse.data.map((task: Task) => ({
                        ...task,
                        reward: Number(task.reward) || 0,
                        current_progress: task.id === INVITE_TASK_ID ? count : undefined, // Set progress only for the invite task
                    }));

                    setTasks(fetchedTasks);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, [userData]);

    useEffect(() => {
        const completedTasks = tasks.filter(task => !task.active || task.ready);
        setCompletedCount(completedTasks.length);
    }, [tasks]);

    const handleClick = async (taskId: number, taskLink: string, taskReward: number) => {
        if (taskId === INVITE_TASK_ID && invitedCount < 5) {
            console.log('You need to invite more friends to complete this task.');
            return;
        }

        window.location.href = taskLink;

        try {
            await axios.post(`${apiUrl}/api/task/${userData.id}/${taskId}/complete`);
            await axios.put(`${apiUrl}/api/balance/plus/${userData.id}`, { amount: taskReward });
            const updatedTasks = await axios.get(`${apiUrl}/api/task/${userData.id}`);
            setTasks(updatedTasks.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) {
        return <Loading />;
    }

    const Completed = () => (
        <span className='arrow-button border-button'>
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

    // Sort tasks, placing completed tasks at the end
    const sortedTasks = tasks.sort((a, b) => {
        const isACompleted = !a.active || a.ready;
        const isBCompleted = !b.active || b.ready;
        return isACompleted === isBCompleted ? 0 : isACompleted ? 1 : -1;
    });

    return (
        <>
            <div className='task-completion-container'>
                <div className='task-completion-count'>
                    Completed:
                    <span className='completed-count'>{completedCount}/{tasks.length}</span>
                </div>
            </div>
            <List>
                {sortedTasks.map((task) => (
                    <Item key={task.id}>
                        <Icon>
                            <img src={task.icon} alt={task.name} className='item-icon' />
                        </Icon>
                        <div className='item-wrapper'>
                            <div className='item-center-container'>
                                <Title>{task.name}</Title>
                                <Subtitle>
                                    <Progress
                                        required_progress={task.required_progress}
                                        current_progress={task.current_progress}
                                    />
                                    <span>
                                        +<NumericValue value={task.reward} decimalPlaces={2} />
                                    </span>
                                </Subtitle>
                            </div>
                            <Right>
                                {!task.active || task.ready ?
                                    <Completed /> :
                                    <ButtonArrow arrowType='next' onClick={() => handleClick(task.id, task.link, Number(task.reward))} />
                                }
                            </Right>
                        </div>
                    </Item>
                ))}
            </List>
        </>
    );
};
