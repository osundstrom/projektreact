import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import "../css/Grade.css"

//tare mot ett betyg(nummer)
const RateBook = ({ grade, setGrade }: { grade: number; setGrade: (value: number) => void }) => {
     const gradearr = [1, 2, 3, 4, 5];//array 1-5

     return (

        /*skapar sjörnoir (fontawesome)baserat på betyg, */ 
        <div className="starBook">
            {gradearr.map((x) => ( 
            <FontAwesomeIcon key={x} icon={faStar} className={x <= grade ? "starYes" : "starNot"} 
            onClick={() => setGrade(x)}/>//uppdaterar värde med klick
            ))}
        </div>


    );
};
export default RateBook;