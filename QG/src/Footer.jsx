function Footer() {
  return (
    <footer className="relative bg-[#FFEF9D] text-center py-10 mt-10">
      <img src="/Group 33.png" alt="Footer Decoration" className="absolute top-[-50px] left-1/2 transform -translate-x-1/2" />
      <p className="text-sm text-gray-700 mt-20">© {new Date().getFullYear()} All rights reserved.</p>
    </footer>
  );
}

export default Footer;
