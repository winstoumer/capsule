import { NavigateFunction } from 'react-router-dom';

export const navigationForward = (navigate: NavigateFunction, path: string) => {
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