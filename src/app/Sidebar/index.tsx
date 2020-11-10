import React from "react";
import "./index.css";
import { cn } from "../utils";

const Sidebar = () => (
  <div className="sidebar-content">
    <Row isOpen text="Trance/House Sets" />
    <Row text="Title 1.1" level={1} />
    <Row text="Title 1.2" level={1} />
    <Row text="Long long long long long long long long long long long long long long long long long long long long long text" />
    <Row text="Title 3" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
    <Row text="Title 4" />
  </div>
);

interface RowProps {
  text: string;
  level?: number;
  isOpen?: boolean;
}

const Row = ({ text, isOpen = false, level = 0 }: RowProps) => (
  <div className="row" title={text} style={{ paddingLeft: level * 20 }}>
    <Chevron className={cn({ "row-arrow": true, "row-arrow-open": isOpen })} />
    <div className="circle" />
    <span>{text}</span>
  </div>
);

const Chevron = ({ className }: { className: string }) => (
  <svg
    className={className}
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 512"
  >
    <path
      fill="white"
      d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"
    />
  </svg>
);

export default Sidebar;
