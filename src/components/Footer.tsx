import "../css/Footer.css";


function Footer() {

    //scrolla till toppen av sidan
    const moveTop = () => {
        window.scrollTo({
            top: 0
        });
    };


    return (
        <>
            <footer>
                <div>
            <button onClick={moveTop} className="topButt btn btn-light">
            &#8593;	Top
            </button>
                <p className="Pfooter">Oskar Sundström - <a href="mailto:ossu2300@student.miun.se">Mejla mig</a></p>
                </div>
            </footer>


        </>
    );
}

export default Footer;