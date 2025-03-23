import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../css/newUser.css";

const NewUser = () => {
  document.title = `Register`; //title

//--------------states---------------------------------------------------------//
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

//--------------skapa användare---------------------------------------------------------//
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) { //om användarnamn eller lösenord ej ifyllda
      setError("Användarnamn och lösenord måste vara ifyllda");
      return;
    }

    else if (username.length < 6 ) { //om användarnamn är mindre än 6 tecken
        setError("Användarnamn måste vara minst 6 tecken");
        return; 
    }

    else if (password.length < 8 ) { //om lösenord är mindre än 8 tecken
        setError("Lösenordet måste vara minst 8 tecken");
        return; 
    }

    else if (!/[A-ZÅÄÖ]/.test(password)) { //om lösenord ej har stor bokstav
        setError("Lösenordet måste ha en stor bokstav");
        return;
    }
    
    else if (!/[0-9]/.test(password)) { //om lösenord ej har siffra
        setError("Lösenordet måste ha minst en siffra")
        return;
    }
       
    try { //post skapa användare
      const response = await fetch("https://projektreactbackend.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) { //om ej ok
        throw new Error(data.error || "Fel vid registrering");
      }

      navigate("/login", { state: { message: "Användare skapad, nu kan du logga in" } });  //navigering
    } catch (error: any) {
      setError("Användare finns redan");
    }
  };

//--------------return---------------------------------------------------------//

  return (
    <div className="container" id="fullNewUser">
      <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
      <h2>Registrera ny användare</h2>

      {/* Formulär frör skapa användar*/}
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

        <div className="divButtons">
        <button id="buttonNewUser" type="submit" className="btn btn-primary">Skapa Konto</button>
        <p id="buttonReturn" className="container">Har du ett konto, <Link id="linkReturn" to="/login"  type="submit" > logga in</Link></p>
        </div>
        
      </form>
    </div>
    </div>
    </div>
  );
};

export default NewUser;