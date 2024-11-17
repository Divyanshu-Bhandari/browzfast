import ClientButtons from "@/components/client-buttons";
import GetStartedButton from "@/components/get-started-button";
import { Separator } from "@/components/ui/separator";

const WelcomePage = () => {
  const ImageCard: React.FC<{
    src: string;
    alt: string;
    title: string;
    heading: string;
    description: string;
  }> = ({ src, alt, title, heading, description }) => {
    return (
      <div className="relative flex flex-col items-center group">
        <img
          className="rounded-lg w-full h-auto max-w-[30rem] object-cover"
          src={src}
          alt={alt}
        />
        <div className="mt-[23%] md:mt-[30%] p-4 absolute inset-0 flex flex-col bg-green-500 bg-opacity-50 rounded-b-lg transition-all duration-300 ease-in-out group-hover:mt-0 group-hover:rounded-t-lg">
          <div className="text-left">
            <div className="w-fit">
              <p className="font-semibold text-sm sm:text-lg inline-block text-left md:mb-2">
                {title}
              </p>
              <Separator />
            </div>

            <p className="font-semibold text-left text-lg lg:text-2xl md:mt-2 text-lime-200">
              {heading}
            </p>

            <p className="mt-3 opacity-0 transition-opacity duration-300 ease-in-out text-sm sm:text-base lg:text-xl group-hover:opacity-100">
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-full flex flex-col items-center bg-white">
      <div className="h-full w-full flex flex-col items-center">
        <div className="w-full max-w-[73rem] flex justify-between items-center">
          <div>
            <img src="/logo.svg" alt="logo" className="h-16 w-auto" />
          </div>
          <ClientButtons />
        </div>

        <div className="w-full flex-grow flex flex-col items-center text-center">
          <div
            className="w-full h-96 md:h-[30rem] px-4 pb-4 flex flex-col items-center justify-center text-center bg-cover bg-center text-white"
            style={{
              backgroundImage: "url(/background1.png)",
              backgroundPosition: "center",
            }}
          >
            <p className="mt-7 text-2xl sm:text-3xl lg:text-4xl font-bold">
              Sync Smoothly, Browse Beautifully
            </p>
            <p className="max-w-96 md:max-w-[30rem] mt-2 font-semibold text-sm sm:text-base">
              Simplify Your Web Navigation with a Beautiful, Synced Homepage and
              Favorites.
            </p>
            <GetStartedButton />
          </div>

          <div className="w-full my-14 px-4">
            <p className="max-w-[73rem] mx-auto text-left text-xl sm:text-2xl lg:text-3xl text-gray-700 ">
              We help you manage your favorite websites with ease, ensuring{" "}
              <span className="text-[#308d46] font-bold">
                seamless browsing
              </span>{" "}
              experiences and{" "}
              <span className="text-[#308d46] font-bold">synchronizing</span>{" "}
              them across your devices for a{" "}
              <span className="text-[#308d46] font-bold">connected</span> web
              experience.
            </p>
          </div>

          <div
            className="w-full h-[50rem] flex flex-col items-center text-center text-white bg-no-repeat bg-center bg-fixed bg-cover"
            style={{ backgroundImage: "url(/background3.png)" }}
          >
            <div className="w-full flex flex-col items-center">
              <div className="max-w-[73rem] mt-48 px-5 py-10 text-left bg-green-800 bg-opacity-95">
                <p className="mb-4 text-2xl font-semibold text-emerald-300">
                  Enhancing Web Navigation with Intelligent Tools
                </p>
                <p className="text-lg">
                  Our platform is designed to simplify your web experience by
                  leveraging cutting-edge technology. Whether it’s managing
                  bookmarks, syncing across devices, or providing personalized
                  suggestions, we ensure that users have a seamless, efficient,
                  and intuitive browsing experience. By continuously refining
                  our algorithms and interface, we offer a solution that evolves
                  with your needs—making sure you stay ahead in today’s
                  fast-paced digital world.
                </p>
              </div>

              <div
                className="w-full min-h-screen pb-14 flex flex-col items-center bg-no-repeat bg-center bg-cover"
                style={{ backgroundImage: "url(/background2.png)" }}
              >
                <p className="w-full max-w-[73rem] px-4 py-10 font-semibold text-3xl lg:text-4xl text-left">
                  See How BrowzFast Enhances Your Browsing Experience
                </p>

                <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <ImageCard
                    src="/sync-image.png"
                    alt="Sync"
                    title="Synchronization"
                    heading="Sync your bookmarks and favorites effortlessly across all devices"
                    description="Stay organized and in-sync, ensuring your favorite content is just a click away, no matter where you are or what device you use."
                  />
                  <ImageCard
                    src="/customization-image.png"
                    alt="Customization"
                    title="Customization"
                    heading="Personalize your browsing experience to match your preferences"
                    description="Tailor themes, layouts, and settings to create a unique interface that reflects your style and enhances your productivity."
                  />
                  <ImageCard
                    src="/accessibility-image.png"
                    alt="Accessibility"
                    title="Accessibility"
                    heading="Access your bookmarks and favorites from any device, anytime"
                    description="Enjoy a seamless browsing experience that adapts to various platforms, making it easy for everyone to use, regardless of their needs or preferences."
                  />
                  <ImageCard
                    src="/intitutive-design-image.png"
                    alt="Intitutive-design"
                    title="Intitutive Design"
                    heading="Navigate your bookmarks with ease through a user-friendly interface"
                    description="Experience an elegantly designed platform that prioritizes simplicity and efficiency, allowing you to find and organize your content effortlessly."
                  />
                </div>
              </div>

              <div className="w-full py-12 bg-gray-50 text-center">
                <h2 className="text-4xl font-bold text-gray-800">
                  Frequently Asked Questions
                </h2>
                <p className="mt-4 text-lg text-gray-600 max-w-[50rem] mx-auto">
                  Got questions? We’re here to help! Find quick answers to some
                  of the most common questions about BrowzFast.
                </p>
                <div className="px-6 mt-8 max-w-[70rem] mx-auto text-left space-y-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-xl text-green-700">
                      How do I sync my bookmarks across devices?
                    </h3>
                    <p className="mt-2 text-gray-700">
                      Simply log into your BrowzFast account on each device.
                      Your bookmarks will automatically stay up-to-date,
                      ensuring you can pick up right where you left off.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-xl text-green-700">
                      Is my data secure with BrowzFast?
                    </h3>
                    <p className="mt-2 text-gray-700">
                      Yes, security is our top priority. We use advanced
                      encryption to protect your data, so your information
                      remains private and secure.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-xl text-green-700">
                      Can I customize the look and feel of BrowzFast?
                    </h3>
                    <p className="mt-2 text-gray-700">
                      Absolutely! With a variety of themes, layouts, and color
                      options, you can personalize BrowzFast to reflect your
                      unique style and preferences.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full px-5 py-20 bg-gradient-to-r from-green-700 to-green-900 text-center text-white">
                <h2 className="text-4xl font-extrabold tracking-wide">
                  Ready to Elevate Your Browsing Experience?
                </h2>
                <p className="mt-6 max-w-3xl mx-auto text-lg lg:text-xl">
                  Discover a smoother, more personalized, and efficient way to
                  keep your favorite websites and bookmarks in sync. Get started
                  with BrowzFast and make every browsing session better.
                </p>
                <div className="mt-8">
                  <GetStartedButton />
                </div>
              </div>

              <footer className="w-full py-10 px-4 bg-gradient-to-r from-green-900 to-gray-900 text-white">
                <div className="max-w-[73rem] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Column 1: About & Logo */}
                  <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
                    <img
                      src="/logo.svg"
                      alt="Logo"
                      className="h-12 w-auto bg-white p-1 rounded-md shadow-md"
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      BrowzFast simplifies your browsing, making bookmark
                      management and accessibility seamless across all your
                      devices.
                    </p>
                  </div>

                  {/* Column 2: Navigation Links */}
                  <div className="space-y-2 text-center md:text-left">
                    <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>
                        <a href="#features" className="hover:text-green-300">
                          Features
                        </a>
                      </li>
                      <li>
                        <a href="#faq" className="hover:text-green-300">
                          FAQs
                        </a>
                      </li>
                      <li>
                        <a href="#contact" className="hover:text-green-300">
                          Contact
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Column 3: Social Media */}
                  <div className="space-y-2 text-center md:text-left">
                    <h4 className="font-semibold text-lg mb-4">
                      Stay Connected
                    </h4>
                    <div className="flex justify-center md:justify-start space-x-4">
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-300"
                      >
                        <i className="fab fa-facebook"></i>
                      </a>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-300"
                      >
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-300"
                      >
                        <i className="fab fa-linkedin"></i>
                      </a>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-300"
                      >
                        <i className="fab fa-instagram"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
                  © 2024 BrowzFast. All rights reserved.
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
