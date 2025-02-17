const AboutUs = () => {
    return (
        <section className="h-screen flex flex-col justify-center items-center text-center px-6 lg:px-36 py-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-6 animate-fade-in">
                About <span className="text-blue-600">MediCamp</span>
            </h1>
            <p className="max-w-3xl text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                MediCamp is dedicated to organizing and managing medical camps efficiently. Our mission is to bridge the gap between 
                healthcare professionals and communities in need, ensuring seamless camp registration, management, and participation.
            </p>

            <div className="flex flex-wrap justify-center gap-8 mt-12">
                {[
                    { title: "Our Mission", desc: "Providing accessible healthcare camps with an easy-to-use management system." },
                    { title: "Why Choose Us?", desc: "Secure, user-friendly, and designed for both organizers and participants." },
                    { title: "Join Our Mission", desc: "Be part of a growing network that enhances healthcare accessibility." }
                ].map((item, index) => (
                    <div 
                        key={index} 
                        className="max-w-xs p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 transform hover:shadow-2xl transition-transform duration-300 ease-in-out"
                    >
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-3">
                            {item.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AboutUs;
