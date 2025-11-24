function Footer() {
  return (
    <footer
      className="w-full bg-[#2F3A36] text-white py-10 border-t border-gray-700/30 font-inter rounded-t-3xl shadow-2xl"
      style={{ position: 'relative', bottom: 0 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-6 border-b border-gray-700/20">
          <div>
            <h3 className="text-[#3F93E6] font-bold text-base mb-2 tracking-wide">Contact</h3>
            <ul className="space-y-1 text-base">
              <li>
                <span className="font-semibold">Email:</span> <a href="mailto:info@VenturePoint-Egypt.com" className="underline hover:text-[#3F93E6] transition">info@VenturePoint-Egypt.com</a>
              </li>
              <li>
                <span className="font-semibold">Phone:</span> <span>+201003400202</span>
              </li>
              <li>
                <span className="font-semibold">Phone:</span> <span>+1202-390-4405</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#3F93E6] font-bold text-base mb-2 tracking-wide">Address</h3>
            <a
              href="https://www.google.com/maps/place/Street+44,+Al+Abageyah,+El+Mokattam,+Cairo+Governorate/@30.0141044,31.287652,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base leading-relaxed underline hover:text-[#3F93E6] transition"
            >
              Street 44, El-Nakheel Compound,<br />First settlement, Cairo, Egypt
            </a>
          </div>
          <div>
            <h3 className="text-[#3F93E6] font-bold text-base mb-2 tracking-wide">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-base">
              <li><a href="/" className="hover:text-[#3F93E6] transition">Home</a></li>
              <li><a href="/about" className="hover:text-[#3F93E6] transition">Our Story</a></li>
              <li><a href="/services" className="hover:text-[#3F93E6] transition">Services</a></li>
                <li><a href="/advisors" className="hover:text-[#3F93E6] transition">Advisors</a></li>
              <li><a href="/projects" className="hover:text-[#3F93E6] transition">Projects</a></li>
              <li><a href="/partners" className="hover:text-[#3F93E6] transition">Partners</a></li>
              <li><a href="/events" className="hover:text-[#3F93E6] transition">Events</a></li>
              <li><a href="/articles" className="hover:text-[#3F93E6] transition">Publications</a></li>
              <li><a href="/contact" className="hover:text-[#3F93E6] transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#3F93E6] font-bold text-base mb-2 tracking-wide">Follow Us</h3>
            <div className="flex gap-4 mt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-base hover:text-[#3F93E6] transition"><i className="fab fa-linkedin-in"></i> LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 text-base text-gray-50/80">
          <span className="text-[#3F93E6]">&copy; {new Date().getFullYear()} VenturePoint.</span>
          <span className="mt-2 sm:mt-0 text-white">All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;