import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#f8edeb] py-6">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        {/* Left Section - Brand */}
        <div className="text-lg mx-auto font-semibold">
          © {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
