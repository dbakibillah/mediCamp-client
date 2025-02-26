import Banner from "../../components/home/Banner";
import {Helmet} from "react-helmet";
import PopularCamps from "../../components/home/PopularCamps";
import FeedbackRating from "../../components/home/FeedbackRating";
import UpcomingEvents from "../../components/home/UpcomingEvents";
import Statistics from "../../components/home/Statistics";
import Newsletter from "../../components/home/Newsletter";
import FAQSection from "../../components/home/FAQSection";
import ServicesSection from "../../components/home/ServicesSection";
const Home = () => {
    return (
        <section>
            <Helmet>
                <title>MediCamp | Home</title>
            </Helmet>
            <Banner />
            <PopularCamps />
            <ServicesSection />
            <Statistics />
            <FeedbackRating />
            <UpcomingEvents />
            <FAQSection />
            <Newsletter />
        </section>
    );
};

export default Home;