import React, { useEffect, useState } from "react";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";

interface TutorialGuideProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TutorialGuide: React.FC<TutorialGuideProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const [run, setRun] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const savedPreferences = JSON.parse(
      localStorage.getItem("uiPreferences") || "{}"
    );

    setIsFirstLogin(savedPreferences?.isFirstLogin ?? true);

    const updateMobileState = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateMobileState();
    window.addEventListener("resize", updateMobileState);

    return () => {
      window.removeEventListener("resize", updateMobileState);
    };
  }, []);

  useEffect(() => {
    if (isFirstLogin && !isMobile) {
      setRun(true);
    }
  }, [isFirstLogin, isMobile]);

  const steps: Step[] = [
    {
      target: "body",
      content: (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-green-700">
            👋 Welcome to Your Dashboard!
          </h2>
          <p className="text-gray-700 mt-2">
            This interactive guide will walk you through the features and help
            you customize your experience.
          </p>
        </div>
      ),
      placement: "center",
    },
    {
      target: ".menu-button",
      content: (
        <div>
          <h3 className="text-lg font-semibold text-green-700">
            📂 Navigation Menu
          </h3>
          <p className="text-gray-700">
            Click this button to toggle the navigation sidebar, where
            you&apos;ll find important sections of the app.
          </p>
        </div>
      ),
    },
    {
      target: ".navigation-menu",
      content: (
        <div>
          <h3 className="text-lg font-semibold text-green-700">🗂 Sidebar</h3>
          <p className="text-gray-700">
            Here is the main navigation menu. Access different features and
            customize your experience.
          </p>
        </div>
      ),
    },
    {
      target: ".manage-bookmark-button",
      content: (
        <div>
          <h3 className="text-lg font-semibold text-green-700">
            📖 Manage Bookmarks
          </h3>
          <p className="text-gray-700">
            You can manage your bookmark files here, including importing and
            exporting them for easy access.
          </p>
        </div>
      ),
    },
    {
      target: ".customize-homepage-button",
      content: (
        <div>
          <h3 className="text-lg font-semibold text-green-700">
            🖌️ Customize Homepage
          </h3>
          <p className="text-gray-700">
            Personalize your homepage by:
            <ul className="list-disc text-left pl-5 mt-2 text-gray-700">
              <li>Changing the background</li>
              <li>Hiding/Showing the clock</li>
              <li>Reordering favourite sites</li>
            </ul>
          </p>
        </div>
      ),
    },
    {
      target: ".how-to-use-button",
      content: (
        <div>
          <h3 className="text-lg font-semibold text-green-700">
            ❓ How to Use
          </h3>
          <p className="text-gray-700">
            This button provides a detailed guide on using the app, including:
          </p>
          <ul className="list-disc text-left pl-5 mt-2 text-gray-700">
            <li>Accessing key features</li>
            <li>
              <strong className="text-green-800 rounded">
                Setting this page as your default homepage or browser new tab
              </strong>
            </li>
          </ul>
        </div>
      ),
    },
    {
      target: ".favorite-website-section",
      content: (
        <div>
          <h3 className="text-lg font-semibold text-green-700">
            ⭐ Favorite Websites
          </h3>
          <p className="text-gray-700">
            Add your favorite websites here for quick access. Just click the
            &quot;Add&quot; button to get started!
          </p>
        </div>
      ),
    },
    {
      target: ".user-button",
      content: (
        <div>
          <h3 className="text-lg font-semibold text-green-700">
            👤 User Profile
          </h3>
          <p className="text-gray-700">
            Click here to access your profile, settings, and logout options.
          </p>
        </div>
      ),
      placement: "left",
    },
    {
      target: ".mode-toggle",
      content: (
        <div>
          <h3 className="text-lg font-semibold text-green-700">
            🌗 Theme Toggle
          </h3>
          <p className="text-gray-700">
            Switch between light and dark modes to suit your preference.
          </p>
        </div>
      ),
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { index, status, type } = data;

    if (type === "step:before" && index === 1) {
      if (!isSidebarOpen) {
        setIsSidebarOpen(true);

        const savedPreferences = JSON.parse(
          localStorage.getItem("uiPreferences") || "{}"
        );
        savedPreferences.isSidebarOpen = true;
        localStorage.setItem("uiPreferences", JSON.stringify(savedPreferences));
      }
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      setIsFirstLogin(false);

      const newPreferences = {
        ...JSON.parse(localStorage.getItem("uiPreferences") || "{}"),
        isFirstLogin: false,
      };
      localStorage.setItem("uiPreferences", JSON.stringify(newPreferences));
    }
  };

  if (!isClient || isFirstLogin === null) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: "#e0f7e9",
          backgroundColor: "#ffffff",
          primaryColor: "#008000",
          textColor: "#004d00",
          zIndex: 1000,
        },
        buttonNext: {
          backgroundColor: "#008000",
          color: "#ffffff",
          borderRadius: "4px",
        },
        buttonSkip: {
          color: "#aaaaaa",
        },
      }}
    />
  );
};

export default TutorialGuide;
