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
                        src="https://i.ibb.co/G5KYSZZ/banner-img.webp"
                        alt="Slide 1"
                        className="object-cover w-full h-[600px]"
                    />
                </div>
                <div>
                    <img
                        src="https://i.ibb.co/jVy5NBJ/banner5.png"
                        alt="Slide 2"
                        className="object-cover w-full h-[600px]"
                    />
                </div>
                <div>
                    <img
                        src="https://i.ibb.co/0Z7JKgJ/banner2.jpg"
                        alt="Slide 3"
                        className="object-cover w-full h-[600px]"
                    />
                </div>
            </Carousel>
        </section>
    );
};

export default Banner;
