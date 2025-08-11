'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next'; // Make sure you've installed: npm i cookies-next

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie('token'); //delete token 
    localStorage.clear(); //Clear localStorage if you're storing anything
    router.push('/login');
  };

  return (
    <aside className="fixed hidden md:block top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0">
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
        <ul className="space-y-2 font-medium">
          {/* Dashboard Link */}
          <li>
            <Link
              href="/dashboard"
              className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                pathname === '/dashboard' ? 'bg-gray-100' : ''
              }`}
            >
              <svg
                className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>

          {/* Product Link */}
          <li>
            <Link
              href="/dashboard/product"
              className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                pathname === '/dashboard/product' ? 'bg-gray-100' : ''
              }`}
            >
              <svg
                className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span className="ml-3">Product</span>
            </Link>
          </li>

          {/* Logout */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              role="menuitem"
            >
              <svg
                className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7"
                />
              </svg>
              <span className="ml-3">Log out</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
