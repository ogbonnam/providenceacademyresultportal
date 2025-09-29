import {
  MdOutlineDashboard,
  MdOutlineGroup,
  MdOutlineSchool,
  MdOutlinePerson,
  MdOutlineLibraryBooks,
  MdOutlineBarChart,
  MdOutlineSettings,
  MdAccessTime,
} from "react-icons/md";

// Note: You'll need to install react-icons: `npm install react-icons`
export const adminMenuItems = [
  {
    name: "Dashboard",
    icon: MdOutlineDashboard,
    href: "/admin/dashboard",
  },
  {
    name: "Students",
    icon: MdOutlineGroup,
    submenus: [
      { name: "Add Students", href: "/admin/students/add" },
      { name: "View Students", href: "/admin/students" },
      { name: "Paused Students", href: "/admin/students/deactivated" },
    ],
  },
  {
    name: "Teachers",
    icon: MdOutlineSchool,
    submenus: [
      { name: "Add Teacher", href: "/admin/teachers/add" },
      { name: "View Teachers", href: "/admin/teachers/view" },
      { name: "Assign to Subject", href: "/admin/teachers/assign-subjects" },
      { name: "Pause Teacher", href: "/admin/teachers/pause" },
    ],
  },
  {
    name: "Parents",
    icon: MdOutlineSchool,
    submenus: [
      { name: "Add Parent", href: "/admin/parents/add" },
      { name: "View Parents", href: "/admin/parents" },
      { name: "Pause parent", href: "/admin/parents/deactivated" },
    ],
  },
  {
    name: "Admins",
    icon: MdOutlinePerson,
    submenus: [{ name: "Add Admins", href: "/admin/admins/add" }],
  },
  {
    name: "Subjects/Classes",
    icon: MdOutlineLibraryBooks,
    submenus: [
      { name: "Add Subject", href: "/admin/subjects/add" },
      { name: "View Subjects", href: "/admin/subjects/view" },
      { name: "Assign Students", href: "/admin/subjects/assign-students" },
      { name: "Add Foundation Year", href: "/admin/subjects/add-year" },
      { name: "Add Foundation Class", href: "/admin/subjects/add-class" },
      {
        name: "Assign Students to Class",
        href: "/admin/subjects/assign-class",
      },
    ],
  },
  {
    name: "Reports",
    icon: MdOutlineBarChart,
    submenus: [
      { name: "Report Broad-sheet", href: "/admin/reports/broadsheet" },
      { name: "Report Entry ", href: "/admin/reports" },
      { name: "Approve Report", href: "/admin/reports/approve" },
      { name: "Publish Report", href: "/admin/reports/publish" },
      { name: "Unpublish Student Helper", href: "/admin/reports/unpublish" },
    ],
  },
  {
    name: "Timetable", // New menu item
    icon: MdAccessTime,
    href: "/admin/timetable",
  },
  {
    name: "Educational Content",
    icon: MdOutlineBarChart,
    submenus: [
      { name: "Video Content", href: "/admin/videos" },
      { name: "Book Content", href: "/admin/reports" },
    ],
  },
];
