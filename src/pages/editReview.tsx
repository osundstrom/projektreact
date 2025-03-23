import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
//import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Review } from '../models/review';
import "../css/editReview.css";
import RateBook from "../components/Grade";
import { useAllCookies } from '../components/AllCookie'; 

const EditReview = () => {
    const { _id } = useParams(); //id
    //console.log(_id)

    const navigate = useNavigate();

    const { token, userId, username, role } = useAllCookies(); //hämtar alla cookies

//---------------------------------states-----------------------------------------------//

    const [review, setReview] = useState<Review | null>(null);
    const [grade, setGrade] = useState(5);
    const [content, setContent] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
//---------------------------------Fetch-----------------------------------------------//
        const fetchReview = async () => {
            try {
                //hömtar recensioner baserat på id
                const response = await fetch(`https://projektreactbackend.onrender.com/review/one/${_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, //autensering token
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error("error vid hämtning");
                }
                document.title = `Edit: ${data.title}`; //sätter title

                //states
                setReview(data);
                setGrade(data.grade);
                setContent(data.content);
            } catch (error: any) {
                setError(error.message);
            }
        };
        
        fetchReview();
    }, [_id, token, navigate]); //uppdaterar vid 

    //om inte autenserad, 
    if (!token || !userId) {
        return <p className="text-danger">Ogiltig token/användare</p>;
    }

    const updateReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (content.trim().length < 20) {//minst 20 tecken för en recensiopn
            setError("Recension måste ha minst 20 tecken");
            return;
        }

        try {
            const reviewData = {
                userId: review?.userId,
                username: review?.username,
                grade,
                content,
            };
//---------------------------------PUT-----------------------------------------------//

            const response = await fetch(`https://projektreactbackend.onrender.com/review/${_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, //med token
                },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) {
                throw new Error("errorFel vid uppdatering");
            }
            navigate(`/profil`); //navigering till profil
        } catch (error: any) {
            setError(error.message);
        }
    };

//---------------------------------DELETE-----------------------------------------------//

    const deleteReview = async () => {
        if (!token || !userId || !username || !role) { //om ej inloggad.
            setError("Ingen token");
            navigate("/login");
            return;
        }

        try {
            //fetch baserat på id
            const response = await fetch(`https://projektreactbackend.onrender.com/review/${_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, //skickar emd token
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Kunde ej radera"); //felmeddelande
            }

            
            
            navigate("/Profil"); //navigering
        } catch (error: any) {
            setError(error.message);
        }
    };
//---------------------------------RETURN-----------------------------------------------//

    return (
        <div className="container">
            <div className="row justify-content-center">
            <div className="col">

            {review ? (  /*om recension finns*/
                <>
                <h5>Recension av: {review.title}</h5>
                <form onSubmit={updateReview}>
                    <div className="mb-3">
                        <label className="form-label">Användare:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={review.username}
                            disabled
                        />
                    </div>

                    <div className="mb-3">
                {/* Betyg(skickas till Ratebook*/}
                <label className="form-label">Betyg:</label>
                <RateBook grade={grade} setGrade={review.username === username ? setGrade : () => {}} />
                </div>

                    <div className="mb-3">
                        <label className="form-label">Recension:</label>
                        <textarea
                            className="form-control"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            disabled={review.username !== username}
                        />
                        {/*Error meddelande*/}
                        {error && <p className="text-danger">{error}</p>}
                    </div>
                    {/*Knapp för spara*/}
                    <button id='buttonSave' type="submit" className="btn btn-success">
                    <FontAwesomeIcon icon={faFloppyDisk} /> 
                        </button>
                        
                </form>
                
                {/*Knapp för radera*/}
            <button id="buttonDelete" onClick={deleteReview} className="btn btn-danger mt-3">
                <FontAwesomeIcon icon={faTrashCan} /> 
            </button>
            
            
            
            </>
        ) : (
            // Om ingen recension hittas
            <p>Hittar ej recension</p>
        )}
        
        </div>
        
        </div>
        </div>
    );
};

export default EditReview;