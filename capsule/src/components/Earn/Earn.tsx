import { useState, useEffect } from 'react';
import axios from 'axios';
import './earn.scss';
import { List, Item, Icon, Title, Subtitle, Right } from '../List/List';
import Loading from '../Loading/Loading';
import Progress from './Progress';
import NumericValue from '../Default/NumericValue';
import IconType from '../Default/IconType';
import { useNotifications } from '../Providers/NotificationContext';

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

    const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);
    const [rewardClaimingTaskId, setRewardClaimingTaskId] = useState<number | null>(null);

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
        const completedTasks = tasks.filter(task => task.is_completed);
        setCompletedCount(completedTasks.length);
    }, [tasks]);

    const handleClick = async (taskId: number, taskLink: string) => {
        if (taskId === INVITE_TASK_ID && invitedCount < 5) {
            const frens = 5 - invitedCount;
            addNotification(`Missing ${frens} frens.`, 'info');
            return;
        }

        setLoadingTaskId(taskId);

        try {
            window.location.href = taskLink;
            await axios.post(`${apiUrl}/api/task/${userData.id}/${taskId}/complete`);
            const updatedTasks = await axios.get(`${apiUrl}/api/task/${userData.id}`);
            setTasks(updatedTasks.data);
        } catch (error) {
            addNotification('Try later.', 'error');
        } finally {
            setLoadingTaskId(null);
        }
    };

    const claimReward = async (taskId: number, taskReward: number) => {
        // Prevent multiple claims for the same task
        if (rewardClaimingTaskId !== null) {
            return;
        }

        setRewardClaimingTaskId(taskId);

        try {
            await axios.post(`${apiUrl}/api/task/${userData.id}/${taskId}/claim`);
            addNotification(`You got ${taskReward}!`, 'success');

            const updatedTasks = await axios.get(`${apiUrl}/api/task/${userData.id}`);
            setTasks(updatedTasks.data);
        } catch (error) {
            addNotification('Try later.', 'error');
        } finally {
            setRewardClaimingTaskId(null);
        }
    };

    const sortedTasks = tasks.sort((a, b) => {
        // Приоритеты: невыполненные (0), выполненные без награды (1), выполненные с наградой (2)
        const getTaskPriority = (task: Task) => {
            if (!task.is_completed) return 0;
            if (task.is_completed && !task.is_reward_claimed) return 1;
            if (task.is_completed && task.is_reward_claimed) return 2;
            return 3; // на случай непредвиденных ситуаций
        };

        return getTaskPriority(a) - getTaskPriority(b);
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
                                {loadingTaskId === task.id ? (
                                    <IconType
                                        type='loading'
                                        size={20}
                                        strokeWidth={2}
                                        border={false}
                                        background='#191219'
                                    />
                                ) : !task.active || task.is_completed ? (
                                    task.is_completed && !task.is_reward_claimed ? (
                                        <span className='claim-reward'>
                                            <IconType
                                                type='checkmark'
                                                size={20}
                                                strokeColor='black'
                                                strokeWidth={2}
                                                border={false}
                                                background='#6d932c'
                                                onClick={() => claimReward(task.id, Number(task.reward))}
                                            />
                                        </span>
                                    ) : (
                                        <IconType
                                            type='checkmark'
                                            size={20}
                                            strokeColor='white'
                                            strokeWidth={2}
                                        />
                                    )
                                ) : (
                                    <IconType
                                        type='arrow-right'
                                        size={20}
                                        strokeWidth={2}
                                        border={false}
                                        background='#191219'
                                        onClick={() => handleClick(task.id, task.link)}
                                    />
                                )}
                            </Right>
                        </div>
                    </Item>
                ))}
            </List>
        </>
    );
};
