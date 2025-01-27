const Footer = () => {
    return (
        <section className="mt-20">
            <footer className="footer bg-gray-950 text-neutral-content p-10 lg:p-20 lg:flex lg:justify-around flex-col md:flex-row space-y-2 md:space-y-0">
                <div className="flex flex-col md:items-start">
                    <h6 className="footer-title text-lg font-semibold mb-3">Services</h6>
                    <a className="link link-hover mb-2">Branding</a>
                    <a className="link link-hover mb-2">Design</a>
                    <a className="link link-hover mb-2">Marketing</a>
                    <a className="link link-hover mb-2">Advertisement</a>
                </div>

                <div className="flex flex-col md:items-start">
                    <h6 className="footer-title text-lg font-semibold mb-3">Company</h6>
                    <a className="link link-hover mb-2">About us</a>
                    <a className="link link-hover mb-2">Contact</a>
                    <a className="link link-hover mb-2">Jobs</a>
                    <a className="link link-hover mb-2">Press kit</a>
                </div>

                <div className="flex flex-col md:items-start">
                    <h6 className="footer-title text-lg font-semibold mb-3">Legal</h6>
                    <a className="link link-hover mb-2">Terms of use</a>
                    <a className="link link-hover mb-2">Privacy policy</a>
                    <a className="link link-hover mb-2">Cookie policy</a>
                </div>
            </footer>
        </section>
    );
};

export default Footer;
