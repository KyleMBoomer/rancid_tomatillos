import PropTypes from 'prop-types';
import './SearchBar.css';

const SearchBar = ({ searchQuery, handleSearchChange }) => {
  return (
    <div className="search-bar">
      <input 
        type="text"
        placeholder="Search for a movie..."
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
    </div>
  );
};

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  handleSearchChange: PropTypes.func.isRequired
};

export default SearchBar;
