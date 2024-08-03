import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

export const navigationForward = (path: string) => {
    const contentElement = document.querySelector('.content');

    if (contentElement) {
        contentElement.classList.add('slideDown');
        setTimeout(() => {
            navigate(path);
        }, 200); // Задержка должна соответствовать длительности анимации
    } else {
        navigate(path);
    }
};