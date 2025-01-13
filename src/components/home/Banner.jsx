import Slider from "@madzadev/image-slider";
import "@madzadev/image-slider/dist/index.css";

const Banner = () => {
    const images = [
        { url: "https://i.ibb.co.com/G5KYSZZ/banner-img.webp" },
        { url: "https://i.ibb.co.com/jVy5NBJ/banner5.png" },
        { url: "https://i.ibb.co.com/0Z7JKgJ/banner2.jpg" },
        { url: "https://i.ibb.co.com/mNp55S5/banner3.webp" },
        { url: "https://i.ibb.co.com/k5KmKF6/banner4.jpg" },
    ];

    return (
        <section className="overflow-x-hidden dark:bg-gray-900">
            <div className="w-[95%] md:w-9/12 container mx-auto">
                <Slider
                    imageList={images}
                    width="100%"
                    height={window.innerWidth < 768 ? "40vh" : "70vh"}
                />
            </div>
        </section>
    );
};

export default Banner;
