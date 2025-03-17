import { useState } from "react";
import Cookies from "js-cookie"; 
import { useNavigate } from "react-router-dom";
import "../css/Login.css"


const Login = () => {

    //------------------------States------------------------------------------------//
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
   
    document.title = "Login";
    const navigate = useNavigate();

    //------------------------Post/login------------------------------------------------//
    const fetchLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true)

         
        if (!username || !password) {
        setError("Användarnamn och lösenord måste fyllas i.");
        setLoading(false);
        return;
    }
        try { 
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},

            body: JSON.stringify({ 
                username, password }),
        })

        const data = await response.json();

        
        if (!response.ok) {
            throw new Error(data.error || "ogiltiga uppgifter");
        }else {

            Cookies.set("username", data.username, {expires: 1});
            Cookies.set("token", data.recivedToken.token, {expires: 1});
            Cookies.set("userId", data.userId, { expires: 1 });
            Cookies.set("role" , data.role, { expires: 1 });
            console.log(data.token, data.userId)
            navigate("/profil");
        
        }} catch(error: any) {
            setError( "Felaktiga inloggningsuppgifter");
        }
        setLoading(false)
    }

    return (
        <div className="container" id="fullLoginForm">
             <div className="row justify-content-center">
             <div className="col-md-6 col-lg-4">
            <h2>Logga in</h2>
            <form onSubmit={fetchLogin}> {/*fetchLogin vid submit*/}
                <div className="form-group">
                    <label className="form-label" htmlFor="username">Användarnamn:</label>
                    <input
                        className="form-control"
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} //Uppdatera på ändring
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="password">Lösenord:</label>
                    <input
                        className="form-control"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} //Uppdatera på ändriogn
                    />
                </div>
                 {/*visa error*/}
                {error && <p className="text-danger">{error}</p>}
                {/* laddning */}
                {loading && (
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                        )}
                <br />
                <div className="mt-3" id="buttonLoggin">
                <button className="btn btn-primary" type="submit">Logga in</button>
                </div>
            </form>

            {/*Register*/}
      <div className="mt-3" id="buttonRegister">
        <button className="btn btn-secondary" onClick={() => navigate("/Register")} >
          Skapa konto
        </button>
      </div>
      </div>
      </div>
        </div>
    );
    

}

export default Login;