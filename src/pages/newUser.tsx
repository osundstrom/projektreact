import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/newUser.css";

const NewUser = () => {
  document.title = `Register`;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Användarnamn och lösenord måste vara ifyllda");
      return;
    }

    else if (username.length < 6 ) { 
        setError("Användarnamn måste vara minst 6 tecken");
        return; 
    }

    else if (password.length < 8 ) { 
        setError("Lösenordet måste vara minst 8 tecken");
        return; 
    }

    else if (!/[A-ZÅÄÖ]/.test(password)) {  
        setError("Lösenordet måste ha en stor bokstav");
        return;
    }
    
    else if (!/[0-9]/.test(password)) { 
        setError("Lösenordet måste ha minst en siffra")
        return;
    }
       
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fel vid registrering");
      }

      navigate("/login"); 
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="container" id="fullNewUser">
      <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
      <h2>Registrera ny användare</h2>
      <form onSubmit={createUser}>
        <div className="form-group">
          <label className="form-label" htmlFor="username">Användarnamn:</label>
          <input
            className="form-control"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">Lösenord:</label>
          <input
            className="form-control"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button id="buttonNewUser" type="submit" className="btn btn-primary">Skapa Konto</button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default NewUser;