import PropTypes from 'prop-types'
import './Dropdown.css'

const Dropdown = ({ selectedGenre, handleGenreChange }) => {
    return (
        <div className="dropdown-container">
            <label htmlFor="genre-dropdown">What Would You Like to Watch?</label>
            <select
                id="genre-dropdown"
                className="genre-dropdown"
                onChange={handleGenreChange}
                value={selectedGenre}
            >
                <option value="">All Genres</option>
                <option value="Action">Action</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Drama">Drama</option>
                <option value="Horror">Horror</option>
            </select>
        </div>
    );
};

Dropdown.propTypes = {
    selectedGenre: PropTypes.string.isRequired,
    handleGenreChange: PropTypes.func.isRequired
}

export default Dropdown 