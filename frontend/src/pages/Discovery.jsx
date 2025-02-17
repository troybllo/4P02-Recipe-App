import discDiamond from '../images/discovery_diamond.png';
import searchIcon from "../images/search.png";
import "../styles/Discovery.css";

export default function Discovery() {
    return (
      <>
        <div>
            <img src={discDiamond} />
            <h1>Your Discovery</h1>
            <p>Discover new recipes here!</p>
        </div>
        <div className="nav-search">
            <input type="text" placeholder="Search..." className="nav-search-input"
            />
            <button className="nav-search-button">
            <img src={searchIcon} />
            </button>
        </div>
      </>
    );
  }
  