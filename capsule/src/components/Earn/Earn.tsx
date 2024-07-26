import { useState, useEffect } from 'react';
import axios from 'axios';
import './earn.scss';
import ButtonArrow from '../Default/ButtonArrow';
import { List, Item, Icon, Title, Subtitle, Right } from '../List/List';
import Loading from '../Loading/Loading';

interface Task {
    id: number;
    name: string;
    reward: number;
    active: boolean;
    link: string;
    ready: boolean;
    icon: string;
}

export const Earn = () => {
    const [userData, setUserData] = useState<any>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [completedCount, setCompletedCount] = useState<number>(0);
    const [invitedCount, setInvitedCount] = useState<number>(0);

    const apiUrl = import.meta.env.VITE_API_URL;
    const INVITE_TASK_ID = 9; // The ID of the "Invite Friends" task

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
        }
    }, []);

    useEffect(() => {
        if (userData && userData.id) {
            fetchTasks(userData.id.toString());
            fetchInvitedCount(userData.id.toString());
        }
    }, [userData]);

    useEffect(() => {
        const completedTasks = tasks.filter(task => !task.active || task.ready);
        setCompletedCount(completedTasks.length);
    }, [tasks]);

    const fetchTasks = async (telegramUserId: string) => {
        try {
            const response = await axios.get(`${apiUrl}/api/task/${telegramUserId}`);
            const data = response.data;

            // Modify or add the "Invite Friends" task based on the invite count
            const inviteTaskIndex = data.findIndex((task: Task) => task.id === INVITE_TASK_ID);
            const inviteTask = {
                id: INVITE_TASK_ID,
                name: `Invite ${invitedCount}/5 frens`,
                reward: 50000,
                active: invitedCount < 5,
                link: "/frens", // replace with the actual link
                ready: invitedCount >= 5,
                icon: "https://i.ibb.co/QQjFnL4/Untitled.png", // replace with the actual icon path
            };

            if (inviteTaskIndex !== -1) {
                data[inviteTaskIndex] = inviteTask;
            } else {
                data.push(inviteTask);
            }

            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInvitedCount = async (telegramUserId: string) => {
        try {
            const response = await axios.get(`${apiUrl}/api/referral/${telegramUserId}`);
            if (!response.data) {
                throw new Error('Error fetching invited count');
            }
            setInvitedCount(response.data.invitedCount);
        } catch (error) {
            console.error(error);
        }
    };

    const handleClick = async (taskId: number, taskLink: string, taskReward: number) => {
        // Special case for the "Invite Friends" task
        if (taskId === INVITE_TASK_ID && invitedCount < 5) {
            console.log('You need to invite more friends to complete this task.');
            return; // Prevent marking the task as complete
        }
    
        // Redirect to the task link (if applicable)
        window.location.href = taskLink;
    
        try {
            // Only mark the task as complete if the task is not "Invite Friends"
            // or if it is, then it must have invitedCount >= 5
            await axios.post(`${apiUrl}/api/task/${userData.id}/${taskId}/complete`);
            await axios.put(`${apiUrl}/api/balance/plus/${userData.id}`, { amount: taskReward });
            fetchTasks(userData.id.toString());
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
                                    <span>+{Number(task.reward.toLocaleString(undefined))} P</span>
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
