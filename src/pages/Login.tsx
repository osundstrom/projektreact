import { useState } from "react";
import Cookies from "js-cookie"; 
import { useNavigate } from "react-router-dom";


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

            
            Cookies.set("token", data.recivedToken.token, {expires: 1});
            Cookies.set("userId", data.userId, { expires: 1 });
            console.log(data.token, data.userId)
            navigate("/profil");
        
        }} catch(error: any) {
            setError(error.message);
        }
        setLoading(false)
    }

    return (
        <div className="container">
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
                {error && <p style={{ color: "red", fontSize: "1.2rem" }} className="error-text">{error}</p>}
                {/* laddning */}
                {loading && (
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                        )}
                <br />
                <button className="btn btn-primary" type="submit">Logga in</button>
            </form>
        </div>
    );
    

}

export default Login;