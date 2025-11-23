import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  MapIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

export default function BottomNav() {
  const location = useLocation();

  const menu = [
    { name: "홈", path: "/", icon: HomeIcon },
    { name: "축제", path: "/festival", icon: MapIcon },
    { name: "알바", path: "/job", icon: SparklesIcon },
    { name: "커뮤니티", path: "/review", icon: ChatBubbleLeftRightIcon },
  ];

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t bg-white shadow-lg">
      <div className="flex justify-between px-4 py-2">
        {menu.map((item) => {
          const Icon = item.icon;

          const active =
            item.path === "/"
              ? location.pathname === "/" // 홈은 완전 일치해야 active
              : location.pathname.startsWith(item.path); // 나머지는 prefix 매칭

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex w-full flex-col items-center justify-center text-xs"
            >
              <Icon className={`h-7 w-7 ${active ? "text-blue-600" : "text-gray-400"}`} />
              <span className={`mt-1 ${active ? "font-semibold text-blue-600" : "text-gray-500"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
