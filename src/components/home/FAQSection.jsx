import { useState } from 'react';

const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "How do I register for a medical camp?",
            answer:
                "To register for a medical camp, go to the 'Available Camps' page, select a camp, and click on the 'Join Camp' button. A registration form will appear where you need to provide your details. Once submitted, you will be successfully enrolled in the camp.",
        },
        {
            question: "Can I cancel my camp registration after payment?",
            answer:
                "You can cancel your registration before payment without any issues. However, if you have already made a payment and it has been confirmed by the organizer, cancellation will not be allowed.",
        },
        {
            question: "How do I make a payment for a camp?",
            answer:
                "After registering for a camp, go to your 'Registered Camps' section in the dashboard. If your camp is unpaid, you will see a 'Pay' button. Click on it to complete the payment using a secure payment gateway like Stripe.",
        },
        {
            question: "How can I become an organizer and create camps?",
            answer:
                "To become an organizer, you need to have an admin-approved account. Once approved, you will gain access to the Organizer Dashboard, where you can add and manage camps, track registrations, and confirm participant payments.",
        },
        {
            question: "Can I give feedback about the camp?",
            answer:
                "Yes! After attending a camp and completing the payment process, you will see a 'Feedback' button in your Registered Camps section. You can provide your feedback and rate the camp, which will be displayed on the website for others to see.",
        },
    ];

    const toggleAnswer = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-8">
            <div className="container mx-auto lg:px-24 p-2">
                <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-6 dark:text-gray-100">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow dark:bg-gray-900 dark:text-gray-100 collapse collapse-arrow hover:bg-gray-200 focus-within:bg-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all dark:border dark:border-gray-800"
                        >
                            <div
                                className="px-6 py-4 cursor-pointer flex justify-between items-center"
                                onClick={() => toggleAnswer(index)}
                            >
                                <h3 className="text-xl font-semibold">{faq.question}</h3>
                                <span className="text-3xl font-bold text-blue-500">
                                    {activeIndex === index ? '-' : '+'}
                                </span>
                            </div>
                            {activeIndex === index && (
                                <div className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;