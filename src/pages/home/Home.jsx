import Banner from "../../components/home/Banner";
import {Helmet} from "react-helmet";
import PopularCamps from "../../components/home/PopularCamps";
import FeedbackRating from "../../components/home/FeedbackRating";
import UpcomingEvents from "../../components/home/UpcomingEvents";
import Statistics from "../../components/home/Statistics";
const Home = () => {
    return (
        <section>
            <Helmet>
                <title>MediCamp | Home</title>
            </Helmet>
            <Banner />
            <PopularCamps />
            <Statistics />
            <FeedbackRating />
            <UpcomingEvents />
        </section>
    );
};

export default Home;