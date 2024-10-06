import  { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";


const SearchInput = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSearch = () => {
    setIsOpen(!isOpen);
    setSearchQuery(""); // Clear the search input when closing
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div
      className={`relative ${
        isOpen ? "w-64" : "w-10"
      } transition-all duration-300`}
    >
      {isOpen ? (
        <>
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search..."
            className="w-full pl-10 pr-8 py-2 bg-transparent rounded-full focus:outline-none  focus:border-none focus:ring-gray-500"
            autoFocus
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            onClick={toggleSearch}
          >
            <IoIosClose size={30} />
          </span>
        </>
      ) : (
        <span className="text-gray-500 cursor-pointer" onClick={toggleSearch}>
          <FaSearch />
        </span>
      )}
    </div>
  );
};

export default SearchInput;
