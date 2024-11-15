import {
  fetchInitialMovies,
  resetMovies,
  setSearchQuery,
} from "@/store/movieSilce";
import { AppDispatch, RootState } from "@/store/store";
import { debounce } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const navLinks = [
  {
    href: "/login",
    label: "Login",
  },
  {
    href: "/register",
    label: "SignUp",
  },
];

const navUserLinks = [
  {
    href: "/logout",
    label: "Logout",
  },
];

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const searchQuery = useSelector(
    (state: RootState) => state.movies.searchQuery
  );
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const [searchInput, setSearchInput] = useState(searchQuery);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      dispatch(setSearchQuery(query));
    }, 400),
    [debounce]
  );

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchInput(query);
    if (query.trim() == "") {
      // If the search input is empty, reset the search state
      dispatch(setSearchQuery(""));
      dispatch(resetMovies());
      dispatch(fetchInitialMovies({ limit: 20 }));
    } else {
      console.log(`header query2: ${query}`);
      debouncedSearch(query);
    }
  };

  const firstName = useSelector((state: RootState) => state.user.firstName); //setup for profile
  const watchlistCount = useSelector(
    (state: RootState) => state.watchlist.count
  );
  useEffect(() => {
    setIsMounted(true); // Set to true after component mounts
  }, []);

  const goToHome = () => {
    router.push("/");
  };

  return (
    <header className="flex justify-between items-center py-4 px-7 mb-3 border-borderColor bg-customRed">
      <div className="cursor-pointer" onClick={goToHome}>
        <Image
          src="https://res.cloudinary.com/di835w1z1/image/upload/v1726561472/logo_gdap68.png"
          alt="Logo"
          className="w-[160px] h-[50px]"
          width="160"
          height="50"
        />
      </div>

      {/* Search Form */}
      {pathname == "/" && (
        <div className="relative mx-5">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <img src="/svg/search.svg" alt="Search" className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={handleSearchInput}
            className="bg-customDarkRed text-white pl-10 pr-4 py-1 border rounded-xl w-[200px] sm:w-[400px] focus:outline-none"
          />
        </div>
      )}

      <nav>
        <ul className="flex gap-x-5 text-white text-[14px]">
          {isMounted && isAuthenticated ? (
            <>
              <li key="profile">
                <span
                  // href="profile"
                  className="p-2"
                >
                  Hi, {firstName}
                </span>
              </li>
              <li key="addmovie">
                <Link
                  href="/addmovie"
                  className="hover:bg-white hover:text-black p-2"
                >
                  Add Movie
                </Link>
              </li>
              <li key="watchlist">
                <Link
                  href="/watchlist"
                  className="hover:bg-white hover:text-black p-2"
                >
                  Favorites{" "}
                  {watchlistCount ? (
                    <p className="inline bg-yellow-300 p-1 rounded-full text-black">
                      {watchlistCount > 0 ? `${watchlistCount}` : null}
                    </p>
                  ) : (
                    <></>
                  )}
                </Link>
              </li>
              {navUserLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:bg-white hover:text-black p-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </>
          ) : (
            navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:bg-white hover:text-black p-2"
                >
                  {link.label}
                </Link>
              </li>
            ))
          )}
        </ul>
      </nav>
    </header>
  );
}
