import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import RateBook from "../components/Grade"
import "../css/Grade.css"
import { useAllCookies } from '../components/AllCookie'; 



const newReview = () => {
    const { bookId } = useParams<{ bookId: string }>(); //id från url
    const navigate = useNavigate(); //navigering
    const location = useLocation(); //info från nuvarande sida


    const { token, userId, username } = useAllCookies(); //hämtar från context

    const [grade, setGrade] = useState<number>(0);
    const [content, setContent] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (location.state?.title) { //hämtar title för boken
          setTitle(location.state.title);  //sätter title state
        }
      }, [location.state]);

    if (!token || !userId) { //om ingen token/userId
        return <p className="text-danger">Ogiltig token</p>;
    }

//---------------------------------AddReview------------------------------------------------------------//
    //lägg till recension
    const AddReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (content.trim().length < 20) { //minst 20 tecken
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
//----------------------------------POST-----------------------------------------------------------//
            const response = await fetch("https://projektreactbackend.onrender.com/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) { //om ej ok
                throw new Error("fel vid recension");
            }

            navigate(`/profil`);

        } catch (error: any) {
            setError(error.message);
        }
    };


//--------------------------------Return-------------------------------------------------------------//    

    return (
        <div className="container" id='fullDivForm'>
            <h4>Recenserar: {location.state.title}</h4>  {/*Boktitel från location */}
            <hr />
            <h5>Användare: {username}</h5>
            {error && <p className="text-danger">{error}</p>}

            <form onSubmit={AddReview}>


                <div className="mb-3">
                <label className="form-label">Betyg:</label>
                <RateBook grade={grade} setGrade={setGrade} />  {/*Skickar in valt betyg till RateBook*/}
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