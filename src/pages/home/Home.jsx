import Banner from "../../components/home/Banner";
import {Helmet} from "react-helmet";
import PopularCamps from "../../components/home/PopularCamps";
const Home = () => {
    return (
        <section>
            <Helmet>
                <title>MediCamp | Home</title>
            </Helmet>
            <Banner />
            <PopularCamps />
        </section>
    );
};

export default Home;