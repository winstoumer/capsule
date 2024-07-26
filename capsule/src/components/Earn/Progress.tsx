import 'react';

interface ProgressProps {
    required_progress?: number; // Optional, might be null or 0
    current_progress?: number; // Optional, to track current progress
}

const Progress: React.FC<ProgressProps> = ({ required_progress, current_progress }) => {
    // Determine if progress should be displayed
    const showProgress = required_progress && required_progress > 0;

    return (
        <>
            {showProgress && (
                <span className="progress-text">
                    {current_progress ?? 0}/{required_progress}
                </span>
            )}
        </>
    );
};

export default Progress;
