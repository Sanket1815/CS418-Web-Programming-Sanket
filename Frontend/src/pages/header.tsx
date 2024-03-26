import { useRouter } from "next/router";
const Header: React.FC = () => {
  const router = useRouter();
  const goToHomePage = () => {
    router.push({
      pathname: "/home",
      query: { email: router.query.email },
    });
  };
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <img
              className="h-8 w-8"
              src="/assests/images/odulog.png"
              alt="Your Logo"
            />
          </div>
          <div className="md:block">
            <div className="ml-auto flex items-baseline space-x-4">
              <button
                onClick={goToHomePage}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
