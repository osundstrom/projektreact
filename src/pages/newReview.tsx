import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import RateBook from "../components/Grade"
import "../css/Grade.css"



const newReview = () => {
    const { bookId } = useParams<{ bookId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const token = Cookies.get("token");
    const userId = Cookies.get("userId");
    const username = Cookies.get("username")

    const [grade, setGrade] = useState<number>(0);
    const [content, setContent] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (location.state?.title) {
          setTitle(location.state.title);  
        }
      }, [location.state]);

    if (!token || !userId) {
        return <p className="text-danger">Ogiltig token</p>;
    }

    const AddReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (content.trim().length < 20) {
            setError("Recension måste ha minst 20 tecken");
            return;
        }

        try {
            const reviewData = {
                bookId,
                userId,
                title,
                username,
                grade,
                content,
            };
            const response = await fetch("http://localhost:3000/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) {
                throw new Error("fel vid recension");
            }

            navigate(`/books/${bookId}`);

        } catch (error: any) {
            setError(error.message);
        }
    };


    

    return (
        <div className="container" id='fullDivForm'>
            <h4>Recenserar: {location.state.title}</h4>
            <hr />
            <h5>Användare: {username}</h5>
            {error && <p className="text-danger">{error}</p>}

            <form onSubmit={AddReview}>


                <div className="mb-3">
                <label className="form-label">Betyg:</label>
                <RateBook grade={grade} setGrade={setGrade} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Recension:</label>
                    <textarea
                        className="form-control"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-success">Skicka</button>
            </form>

        </div>
    );

};


export default newReview;