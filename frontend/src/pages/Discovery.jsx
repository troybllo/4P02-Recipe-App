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
        <div className="nav-search-discovery">
            <input type="text" placeholder="Search..." className="nav-search-input-discovery"
            />
            <button className="nav-search-button-discovery">
                <img src={searchIcon} />
            </button>
        </div>
      </>
    );
  }
  