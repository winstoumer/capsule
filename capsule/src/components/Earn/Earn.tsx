import { useState, useEffect } from 'react';
import axios from 'axios';
import './earn.scss';
import { List, Item, Icon, Title, Subtitle, Right } from '../List/List';
import Loading from '../Loading/Loading';
import Progress from './Progress';
import NumericValue from '../Default/NumericValue';
import IconType from '../Default/IconType';
import { useNotifications } from '../Providers/NotificationContext';
import React from 'react';

interface Task {
    id: number;
    name: string;
    reward: number;
    active: boolean;
    link: string;
    ready: boolean;
    icon: string;
    required_progress?: number;
    current_progress?: number;
    is_completed?: boolean;
    is_reward_claimed?: boolean;
}

export const Earn = () => {
    const { addNotification } = useNotifications();
    const [userData, setUserData] = useState<any>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [completedCount, setCompletedCount] = useState<number>(0);
    const [invitedCount, setInvitedCount] = useState<number>(0);

    const [clickDisabled, setClickDisabled] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;
    const INVITE_TASK_ID = 9;

    const MemoizedIconType = React.memo(IconType);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (userData && userData.id) {
                try {
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

                    const tasksResponse = await axios.get(`${apiUrl}/api/task/${userData.id}`);
                    const fetchedTasks = tasksResponse.data.map((task: Task) => {
                        const rewardNumber = Number(task.reward);
                        return {
                            ...task,
                            reward: !isNaN(rewardNumber) ? rewardNumber : 0,
                            current_progress: task.id === INVITE_TASK_ID ? count : undefined,
                        };
                    });

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
        const completedTasks = tasks.filter(task => task.is_completed && !task.is_reward_claimed);
        setCompletedCount(completedTasks.length);
    }, [tasks]);

    const handleClick = async (taskId: number, taskLink: string) => {
        if (clickDisabled) return;
    
        console.log("Click handler called");
    
        setClickDisabled(true);
    
        if (taskId === INVITE_TASK_ID && invitedCount < 5) {
            const frens = 5 - invitedCount;
            console.log(`Missing ${frens} frens. Notification should appear once`);
            addNotification(`Missing ${frens} frens.`, 'info');
            setClickDisabled(false);
            return;
        }
    
        try {
            window.location.href = taskLink;
            await axios.post(`${apiUrl}/api/task/${userData.id}/${taskId}/complete`);
            const updatedTasks = await axios.get(`${apiUrl}/api/task/${userData.id}`);
            setTasks(updatedTasks.data);
        } catch (error) {
            addNotification('Error completing the task.', 'error');
        } finally {
            console.log("Resetting clickDisabled");
            setClickDisabled(false);
        }
    };    

    const claimReward = async (taskId: number, taskReward: number) => {
        if (clickDisabled) return;

        setClickDisabled(true);

        try {
            await axios.post(`${apiUrl}/api/task/${userData.id}/${taskId}/claim`);
            addNotification(`You got ${taskReward}!`, 'success');

            const updatedTasks = await axios.get(`${apiUrl}/api/task/${userData.id}`);
            setTasks(updatedTasks.data);
        } catch (error) {
            addNotification('Ошибка при получении награды.', 'error');
        } finally {
            setClickDisabled(false); // Разблокируем клики
        }
    };

    const sortedTasks = tasks.sort((a, b) => {
        const isACompleted = a.is_completed && !a.is_reward_claimed;
        const isBCompleted = b.is_completed && !b.is_reward_claimed;
        return isACompleted === isBCompleted ? 0 : isACompleted ? 1 : -1;
    });

    if (loading) {
        return <Loading />;
    }

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
                                        +<NumericValue value={task.reward} />
                                    </span>
                                </Subtitle>
                            </div>
                            <Right>
                                {!task.active || task.is_completed ?
                                    (task.is_completed && !task.is_reward_claimed ?
                                        <MemoizedIconType
                                            type='checkmark'
                                            size={20}
                                            strokeColor='black'
                                            strokeWidth={2}
                                            border={false}
                                            background='#65445A'
                                            disabled={clickDisabled}
                                            onClick={() => claimReward(task.id, Number(task.reward))}
                                        /> :
                                        <IconType
                                            type='checkmark'
                                            size={20}
                                            strokeColor='white'
                                            strokeWidth={1}
                                        />
                                    ) :
                                    <MemoizedIconType
                                        type='arrow-right'
                                        size={20}
                                        strokeWidth={2}
                                        border={false}
                                        background='#191219'
                                        disabled={clickDisabled}
                                        onClick={() => handleClick(task.id, task.link)}
                                    />
                                }
                            </Right>
                        </div>
                    </Item>
                ))}
            </List>
        </>
    );
};
