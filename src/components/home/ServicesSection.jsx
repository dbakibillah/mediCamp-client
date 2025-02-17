const ServicesSection = () => {
    return (
        <section className="container mx-auto lg:px-24 py-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">
                    Our Services
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
                    Providing accessible healthcare services to communities through our well-organized medical camps.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto px-4">
                {/* Service 1 */}
                <div className="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl text-center transform transition duration-300 hover:shadow-2xl">
                    <h3 className="text-2xl font-semibold dark:text-white mb-4">Free Health Checkups</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Comprehensive medical examinations at no cost.
                    </p>
                </div>

                {/* Service 2 */}
                <div className="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl text-center transform transition duration-300 hover:shadow-2xl">
                    <h3 className="text-2xl font-semibold dark:text-white mb-4">Specialist Consultations</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Meet with healthcare professionals for expert advice.
                    </p>
                </div>

                {/* Service 3 */}
                <div className="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl text-center transform transition duration-300 hover:shadow-2xl">
                    <h3 className="text-2xl font-semibold dark:text-white mb-4">Emergency Medical Support</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Immediate assistance in case of medical emergencies.
                    </p>
                </div>

                {/* Service 4 */}
                <div className="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl text-center transform transition duration-300 hover:shadow-2xl">
                    <h3 className="text-2xl font-semibold dark:text-white mb-4">Medication & Treatment</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Receive essential medications and treatment plans.
                    </p>
                </div>

                {/* Service 5 */}
                <div className="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl text-center transform transition duration-300 hover:shadow-2xl">
                    <h3 className="text-2xl font-semibold dark:text-white mb-4">Awareness Campaigns</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Educational programs on health and disease prevention.
                    </p>
                </div>

                {/* Service 6 */}
                <div className="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl text-center transform transition duration-300 hover:shadow-2xl">
                    <h3 className="text-2xl font-semibold dark:text-white mb-4">Mental Health Support</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Professional counseling for mental well-being.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
