import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="flex flex-row gap-3 justify-evenly">
        <Link>
          <h3>Home</h3>
        </Link>
        <Link>
          <h3>About Us</h3>
        </Link>
        <Link>
          <h3>Contact Us</h3>
        </Link>
      </nav>
    </div>
  );
}
