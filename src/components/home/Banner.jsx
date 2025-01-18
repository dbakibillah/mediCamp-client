import "react-responsive-carousel/lib/styles/carousel.min.css"; // Requires a loader
import { Carousel } from "react-responsive-carousel";

const Banner = () => {
    return (
        <section className="overflow-x-hidden bg-gray-100 dark:bg-gray-900 container mx-auto lg:px-24">
            <Carousel
                showThumbs={false}
                showStatus={false}
                showIndicators={false}
                stopOnHover
                autoPlay
                infiniteLoop
            >
                <div>
                    <img
                        src="https://i.ibb.co.com/JjWw8Nd/b3.png"
                        alt="Slide 1"
                        className="object-cover w-full h-[550px]"
                    />
                </div>
                <div>
                    <img
                        src="https://i.ibb.co.com/RhHmnGc/b2.png"
                        alt="Slide 2"
                        className="object-cover w-full h-[550px]"
                    />
                </div>
                <div>
                    <img
                        src="https://i.ibb.co.com/zrkF3F8/b1.png"
                        alt="Slide 3"
                        className="object-cover w-full h-[550px]"
                    />
                </div>
                <div>
                    <img
                        src="https://i.ibb.co.com/gggf2f0/b4.png"
                        alt="Slide 4"
                        className="object-cover w-full h-[550px]"
                    />
                </div>
            </Carousel>
        </section>
    );
};

export default Banner;
