import 'react';

interface ProgressProps {
    required_progress?: number;
    current_progress?: number;
}

const Progress: React.FC<ProgressProps> = ({ required_progress, current_progress }) => {
    const showProgress = required_progress && required_progress > 0;

    return (
        <>
            {showProgress && (
                <span className="progress-text">
                    {current_progress ?? 0}/{required_progress},
                </span>
            )}
        </>
    );
};

export default Progress;
