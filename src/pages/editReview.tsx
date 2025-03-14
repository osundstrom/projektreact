import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Review } from '../models/review';
import "../css/editReview.css";
import RateBook from "../components/Grade"

const EditReview = () => {
    const { _id } = useParams();
    console.log(_id)
    const navigate = useNavigate();

    const token = Cookies.get("token");
    const userId = Cookies.get("userId");
    const username = Cookies.get("username");

    const [review, setReview] = useState<Review | null>(null);
    const [grade, setGrade] = useState(5);
    const [content, setContent] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
//---------------------------------Fetch/post-----------------------------------------------//
        const fetchReview = async () => {
            try {
                const response = await fetch(`http://localhost:3000/review/one/${_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error("error vid hämtning");
                }

                setReview(data);
                setGrade(data.grade);
                setContent(data.content);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchReview();
    }, [_id, userId, token]);

    if (!token || !userId) {
        return <p className="text-danger">Ogiltig token</p>;
    }

    const updateReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (content.trim().length < 20) {
            setError("Recension måste ha minst 20 tecken");
            return;
        }

        try {
            const reviewData = {
                userId,
                username,
                grade,
                content,
            };
//---------------------------------PUT-----------------------------------------------//

            const response = await fetch(`http://localhost:3000/review/${_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) {
                throw new Error("errorFel vid uppdatering");
            }

            navigate(`/profil`);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const deleteReview = async () => {
        if (!token) {
            setError("Ingen token");
            navigate("/login");
            return;
        }
//---------------------------------DELETE-----------------------------------------------//
        try {
            const response = await fetch(`http://localhost:3000/review/${_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Kunde ej radera");
            }

            navigate("/Profil");
        } catch (error: any) {
            setError(error.message);
        }
    };
//---------------------------------RETURN-----------------------------------------------//

    return (
        <div className="container">
            <div className="row justify-content-center">
            <div className="col">
            {error && <p className="text-danger">{error}</p>}

            {review ? (
                <>
                <h5>Recension av: {review.title}</h5>
                <form onSubmit={updateReview}>
                    <div className="mb-3">
                        <label className="form-label">Användare:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            readOnly
                        />
                    </div>

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
                    
                    <button id='buttonSave' type="submit" className="btn btn-success">
                    <FontAwesomeIcon icon={faFloppyDisk} /> 
                        </button>
                        
                </form>
                
            <button id="buttonDelete" onClick={deleteReview} className="btn btn-danger mt-3">
                <FontAwesomeIcon icon={faTrashCan} /> 
            </button>
            
            
            </>
        ) : (
            <p>Hittar ej recension</p>
        )}
        
        </div>
        </div>
        </div>
    );
};

export default EditReview;