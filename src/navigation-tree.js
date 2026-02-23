const navigationTree = [
  {
    id: "0",
    name: "Pending Work Items",
    type: "folder",
    openByDefault: true,
    isRoot: true,
    visibility: ["Admin", "Director", "Underwriter"],
    url: "/pending-items",
  },
  {
    id: "1",
    name: "SAC Administration",
    type: "folder",
    openByDefault: true,
    isRoot: true,
    visibility: ["Admin", "Director", "Underwriter"],
    children: [
      {
        id: "2",
        name: "Manage Accounts",
        type: "folder",
        openByDefault: false,
        visibility: ["Admin", "Director", "Underwriter"],
        children: [
          {
            id: "3",
            name: "SAC - View Account",
            type: "file",
            openByDefault: false,
            visibility: ["Admin", "Director"],
            url: "/sac-view-account",
          },
          {
            id: "4",
            name: "SAC - Create New Account",
            type: "file",
            openByDefault: false,
            visibility: ["Underwriter"],
            url: "/sac-create-new-account",
          },
          {
            id: "5",
            name: "AFFINITY - View Program",
            type: "file",
            openByDefault: false,
            visibility: ["Admin", "Director"],
            url: "/affinity-view-program",
          },
          {
            id: "8",
            name: "AFFINITY - Create New Program",
            type: "file",
            openByDefault: false,
            visibility: ["Underwriter"],
            url: "/affinity-create-new-program",
          },
        ],
      },
      {
        id: "9",
        name: "SAC List Management",
        type: "folder",
        openByDefault: false,
        visibility: ["Admin"],
        children: [
          {
            id: "10",
            name: "List Management",
            type: "file",
            openByDefault: false,
            visibility: ["Admin"],
            url: "/list-management",
          },
        ],
      },
    ],
  },
  {
    id: "6",
    name: "CCT Team",
    type: "folder",
    openByDefault: false,
    isRoot: true,
    visibility: ["Admin"],
    children: [
      {
        id: "7",
        name: "Find Special Accounts",
        type: "file",
        openByDefault: false,
        visibility: ["Admin"],
        url: "view-cct-accounts/affinity=false",
      },
    ],
  },
];

export default navigationTree;
