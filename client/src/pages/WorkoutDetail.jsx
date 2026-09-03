import { useParams } from 'react-router-dom';

function WorkoutDetail() {
    const { id } = useParams();
    
    return (
        <div>
            <h1>Workout Detail</h1>
            <p>Showing workout with id: {id}</p>
        </div>
    );
}

export default WorkoutDetail;