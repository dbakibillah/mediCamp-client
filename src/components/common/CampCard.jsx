import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const CampCard = ({ camp }) => {
    const { id, name, image, dateTime, location, healthcareProfessional, participantCount, description, fees } = camp;

    return (
        <div className="flex flex-col justify-between rounded-lg shadow-lg p-6 bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300">
            <div>
                {/* Image */}
                <img
                    src={image}
                    alt={name}
                    className="w-full h-48 object-cover rounded-t-md mb-4"
                />
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{name}</h3>
                {/* Details */}
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mb-4">
                    <p>
                        <strong className="text-gray-800 dark:text-gray-100">Date & Time:</strong>{" "}
                        {new Date(dateTime).toLocaleString()}
                    </p>
                    <p>
                        <strong className="text-gray-800 dark:text-gray-100">Location:</strong> {location}
                    </p>
                    <p>
                        <strong className="text-gray-800 dark:text-gray-100">Healthcare Professional:</strong>{" "}
                        {healthcareProfessional}
                    </p>
                    <p>
                        <strong className="text-gray-800 dark:text-gray-100">Camp Fees:</strong> ${fees}
                    </p>
                    <p>
                        <strong className="text-gray-800 dark:text-gray-100">Participants:</strong> {participantCount}
                    </p>
                </div>
                {/* Description */}
                <p className="text-gray-700 dark:text-gray-400 mb-6">
                    {description.substring(0, 100)}...
                </p>
            </div>
            {/* View Details Button */}
            <Link
                to={`/camp-details/${id}`}
                className="block bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-3 rounded-lg shadow-md hover:from-indigo-600 hover:to-blue-500 transition-all duration-300"
            >
                View Details
            </Link>
        </div>
    );
};

CampCard.propTypes = {
    camp: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        dateTime: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        healthcareProfessional: PropTypes.string.isRequired,
        participantCount: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        fees: PropTypes.number.isRequired,
    }).isRequired,
};

export default CampCard;
