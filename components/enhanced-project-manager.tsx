"use client";

import { useState, useCallback, useMemo } from "react";
// import { useState, useEffect, useCallback, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
// import { Toast } from "@/components/ui/toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  CalendarIcon,
  List,
  // Users,
  Folder,
  BarChart2,
  MessageSquare,
  // Paperclip,
  Bell,
  Home,
  Filter,
  LogIn,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  FileUp,
  Brain,
  Download,
  Loader,
  PieChart,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import { Chart } from "react-google-charts";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as XLSX from "xlsx";

// 型定義（前回のコードから変更なし）
type Priority = "低" | "中" | "高";
type TaskStatus = "未着手" | "対応中" | "完了";
type TaskType =
  | "機能開発"
  | "バグ修正"
  | "ドキュメント作成"
  | "テスト"
  | "その他";

type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  assignee: string;
  dueDate: Date;
  project: string;
  priority: Priority;
  startDate: Date;
  dependencies: number[];
  attachments: string[];
  status: TaskStatus;
  type: TaskType;
};

type Project = {
  id: number;
  name: string;
  dependencies: number[];
  tasks: Task[];
  notes: string;
};

type Discussion = {
  id: number;
  author: string;
  content: string;
  timestamp: Date;
  projectId: number;
};

type Notification = {
  id: number;
  message: string;
  type: "deadline" | "comment";
  timestamp: Date;
};

type TeamMember = {
  id: number;
  name: string;
  role: string;
};

// type CalendarEvent = {
//   id: number;
//   title: string;
//   date: Date;
//   type: "task" | "meeting" | "other";
//   description: string;
// };

type User = {
  id: number;
  username: string;
  password: string;
};

type SharedFile = {
  id: number;
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
};

// ... 既存の型定義の後に追加 ...
type TabValue =
  | "overview"
  | "dashboard"
  | "tasks"
  | "gantt"
  | "files"
  | "discussions"
  | "ai";
type ActivePage = "project" | "calendar";

const priorities: Priority[] = ["低", "中", "高"];
const taskStatuses: TaskStatus[] = ["未着手", "対応中", "完了"];
const taskTypes: TaskType[] = [
  "機能開発",
  "バグ修正",
  "ドキュメント作成",
  "テスト",
  "その他",
];

export function EnhancedProjectManagerComponent() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "ウェブサイトリニューアル",
      dependencies: [],
      tasks: [],
      notes: "",
    },
    {
      id: 2,
      name: "モバイルアプリ開発",
      dependencies: [1],
      tasks: [],
      notes: "",
    },
    {
      id: 3,
      name: "マーケティングキャンペーン",
      dependencies: [1, 2],
      tasks: [],
      notes: "",
    },
  ]);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "要件定義",
      description: "プロジェクトの要件を定義する",
      completed: true,
      assignee: "田中 太郎",
      dueDate: new Date(2023, 5, 10),
      project: "ウェブサイトリニューアル",
      priority: "高",
      startDate: new Date(2023, 5, 1),
      dependencies: [],
      attachments: [],
      status: "完了",
      type: "ドキュメント作成",
    },
    {
      id: 2,
      title: "デザイン作成",
      description: "ウェブサイトのデザインを作成する",
      completed: false,
      assignee: "佐藤 花子",
      dueDate: new Date(2023, 5, 20),
      project: "ウェブサイトリニューアル",
      priority: "中",
      startDate: new Date(2023, 5, 11),
      dependencies: [1],
      attachments: [],
      status: "対応中",
      type: "機能開発",
    },
    {
      id: 3,
      title: "フロントエンド開発",
      description: "ウェブサイトのフロントエンドを開発する",
      completed: false,
      assignee: "鈴木 一郎",
      dueDate: new Date(2023, 6, 15),
      project: "ウェブサイトリニューアル",
      priority: "高",
      startDate: new Date(2023, 5, 21),
      dependencies: [2],
      attachments: [],
      status: "未着手",
      type: "機能開発",
    },
    {
      id: 4,
      title: "バックエンド開発",
      description: "ウェブサイトのバックエンドを開発する",
      completed: false,
      assignee: "高橋 次郎",
      dueDate: new Date(2023, 6, 30),
      project: "ウェブサイトリニューアル",
      priority: "高",
      startDate: new Date(2023, 6, 1),
      dependencies: [2],
      attachments: [],
      status: "未着手",
      type: "機能開発",
    },
    {
      id: 5,
      title: "テスト",
      description: "ウェブサイトのテストを実施する",
      completed: false,
      assignee: "山田 花子",
      dueDate: new Date(2023, 7, 15),
      project: "ウェブサイトリニューアル",
      priority: "中",
      startDate: new Date(2023, 7, 1),
      dependencies: [3, 4],
      attachments: [],
      status: "未着手",
      type: "テスト",
    },
  ]);
  const [newTask, setNewTask] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>(
    projects[0].name
  );
  const [date] = useState<Date | undefined>(new Date());
  // const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: 1,
      author: "田中 太郎",
      content: "ウェブサイトリニューアルの進捗はいかがでしょうか？",
      timestamp: new Date(2023, 5, 5),
      projectId: 1,
    },
    {
      id: 2,
      author: "佐藤 花子",
      content: "デザンが完了しました。レビューをお願いします。",
      timestamp: new Date(2023, 5, 12),
      projectId: 1,
    },
  ]);
  const [newDiscussion, setNewDiscussion] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
  const [teamMembers] = useState<TeamMember[]>([
    { id: 1, name: "田中 太郎", role: "プロジェクトマネージャー" },
    { id: 2, name: "佐藤 花子", role: "デザイナー" },
    { id: 3, name: "鈴木 一郎", role: "フロントエンドエンジニア" },
    { id: 4, name: "高橋 次郎", role: "バックエンドエンジニア" },
    { id: 5, name: "山田 花子", role: "QAエンジニア" },
    { id: 6, name: "貝森 遼太", role: "ディレクター" },
  ]);
  // const [newMember, setNewMember] = useState({ name: "", role: "" });
  // const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
  //   {
  //     id: 1,
  //     title: "キックオフミーティング",
  //     date: new Date(2023, 5, 1),
  //     type: "meeting",
  //     description: "プロジェクトの開始ミーティング",
  //   },
  //   {
  //     id: 2,
  //     title: "デザインレビュー",
  //     date: new Date(2023, 5, 15),
  //     type: "meeting",
  //     description: "ウェブサイトデザインのレビュー",
  //   },
  //   {
  //     id: 3,
  //     title: "フロントエンド開発開始",
  //     date: new Date(2023, 5, 21),
  //     type: "task",
  //     description: "フロントエンド開発の開始",
  //   },
  // ]);
  // const [newEvent, setNewEvent] = useState({
  //   title: "",
  //   date: new Date(),
  //   type: "task" as "task" | "meeting" | "other",
  //   description: "",
  // });
  // const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
  //   null
  // );
  const [activePage, setActivePage] = useState<ActivePage>("project");
  const [taskFilter, setTaskFilter] = useState({
    assignee: "all",
    priority: "all",
    status: "all",
    type: "all",
  });
  const [newProject, setNewProject] = useState({
    name: "",
    members: [] as string[],
  });
  // const [users, setUsers] = useState<User[]>([
  const [users] = useState<User[]>([
    { id: 1, username: "admin", password: "admin123" },
    { id: 2, username: "user1", password: "user123" },
    { id: 3, username: "user2", password: "user456" },
    { id: 4, username: "Ryota.K", password: "password" },
  ]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
  const [newFile, setNewFile] = useState<File | null>(null);
  // const [budget, setBudget] = useState(1000000); // 仮の予算（円）
  const [budget] = useState(1000000); // 仮の予算（円）
  // const [expenses, setExpenses] = useState(0); // 仮の支出（円）
  const [expenses] = useState(0); // 仮の支出（円）

  // 新しい状態変数
  const [aiAssistantMessage, setAiAssistantMessage] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [projectIssues, setProjectIssues] = useState("");
  const [aiAnalysisResult, setAiAnalysisResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // ... 既存のコード ...
  const [activeTab, setActiveTab] = useState<TabValue>("overview");

  // 以下、コンポーネントの関数を定義

  const addNotification = useCallback(
    (message: string, type: "deadline" | "comment") => {
      setNotifications((prev) => [
        ...prev,
        { id: Date.now(), message, type, timestamp: new Date() },
      ]);
    },
    []
  );

  const addTask = useCallback(() => {
    if (newTask.trim() !== "") {
      const newTaskObj = {
        id: tasks.length + 1,
        title: newTask,
        description: "",
        completed: false,
        assignee: "未割当",
        dueDate: date || new Date(),
        project: selectedProject,
        priority: "中" as Priority,
        startDate: new Date(),
        dependencies: [],
        attachments: [],
        status: "未着手" as TaskStatus,
        type: "その他" as TaskType,
      };
      setTasks((prev) => [...prev, newTaskObj]);
      setNewTask("");
    }
  }, [newTask, date, selectedProject, tasks.length]);

  // const toggleTask = useCallback((id: number) => {
  //   setTasks((prev) =>
  //     prev.map((task) => {
  //       if (task.id === id) {
  //         const newStatus: TaskStatus =
  //           task.status === "完了" ? "対応中" : "完了";
  //         return {
  //           ...task,
  //           completed: newStatus === "完了",
  //           status: newStatus,
  //         };
  //       }
  //       return task;
  //     })
  //   );
  // }, []);

  const openTaskDetails = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setSelectedTask(null);
  }, []);

  const addDiscussion = useCallback(() => {
    if (newDiscussion.trim() !== "") {
      const newDiscussionObj = {
        id: discussions.length + 1,
        author: currentUser ? currentUser.username : "ゲスト",
        content: newDiscussion,
        timestamp: new Date(),
        projectId: projects.find((p) => p.name === selectedProject)?.id || 1,
      };
      setDiscussions((prev) => [...prev, newDiscussionObj]);
      setNewDiscussion("");
      addNotification(
        `新しいコメントが追加されました: "${newDiscussion.substring(0, 30)}${
          newDiscussion.length > 30 ? "..." : ""
        }"`,
        "comment"
      );
    }
  }, [
    newDiscussion,
    discussions.length,
    projects,
    selectedProject,
    addNotification,
    currentUser,
  ]);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, taskId: number) => {
      const file = event.target.files?.[0];
      if (file) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? { ...task, attachments: [...task.attachments, file.name] }
              : task
          )
        );
      }
    },
    []
  );

  const getGanttChartData = useMemo(() => {
    return [
      [
        { type: "string", label: "Task ID" },
        { type: "string", label: "Task Name" },
        { type: "string", label: "Resource" },
        { type: "date", label: "Start Date" },
        { type: "date", label: "End Date" },
        { type: "number", label: "Duration" },
        { type: "number", label: "Percent Complete" },
        { type: "string", label: "Dependencies" },
      ],
      ...tasks
        .filter((task) => task.project === selectedProject)
        .map((task) => [
          task.id.toString(),
          task.title,
          task.assignee,
          task.startDate,
          task.dueDate,
          null,
          task.completed ? 100 : task.status === "対応中" ? 50 : 0,
          task.dependencies.join(","),
        ]),
    ];
  }, [tasks, selectedProject]);

  const renderTaskColumn = useCallback(
    (status: TaskStatus) => (
      <div className='flex-1 bg-gray-100 p-4 rounded-lg'>
        <h3 className='text-lg font-semibold mb-4'>{status}</h3>
        <ul className='space-y-2'>
          {tasks
            .filter(
              (task) =>
                task.project === selectedProject &&
                task.status === status &&
                (taskFilter.assignee === "all" ||
                  task.assignee === taskFilter.assignee) &&
                (taskFilter.priority === "all" ||
                  task.priority === taskFilter.priority) &&
                (taskFilter.type === "all" || task.type === taskFilter.type)
            )
            .map((task) => (
              <li key={task.id} className='bg-white p-3 rounded shadow-sm'>
                <div className='flex items-center justify-between'>
                  <span
                    className={
                      task.completed ? "line-through text-gray-500" : ""
                    }
                  >
                    {task.title}
                  </span>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => openTaskDetails(task)}
                  >
                    詳細
                  </Button>
                </div>
                <div className='flex items-center mt-2 text-sm text-gray-600'>
                  <Badge
                    variant={
                      task.priority === "高"
                        ? "destructive"
                        : task.priority === "中"
                        ? "default"
                        : "secondary"
                    }
                    className='mr-2'
                  >
                    {task.priority === "高" ? (
                      <AlertTriangle className='w-3 h-3 mr-1' />
                    ) : task.priority === "中" ? (
                      <CheckCircle2 className='w-3 h-3 mr-1' />
                    ) : null}
                    {task.priority}
                  </Badge>
                  <span>{task.assignee}</span>
                </div>
              </li>
            ))}
        </ul>
      </div>
    ),
    [tasks, selectedProject, taskFilter, openTaskDetails]
  );

  // const addTeamMember = useCallback(() => {
  //   if (newMember.name && newMember.role) {
  //     setTeamMembers((prev) => [
  //       ...prev,
  //       { id: prev.length + 1, ...newMember },
  //     ]);
  //     setNewMember({ name: "", role: "" });
  //   }
  // }, [newMember]);

  // const addCalendarEvent = useCallback(() => {
  //   if (newEvent.title && newEvent.date) {
  //     setCalendarEvents((prev) => [
  //       ...prev,
  //       { id: prev.length + 1, ...newEvent },
  //     ]);
  //     setNewEvent({
  //       title: "",
  //       date: new Date(),
  //       type: "task",
  //       description: "",
  //     });
  //   }
  // }, [newEvent]);

  const addProject = useCallback(() => {
    if (newProject.name.trim() !== "") {
      const newProjectObj = {
        id: projects.length + 1,
        name: newProject.name,
        dependencies: [],
        tasks: [],
        notes: "",
      };
      setProjects((prev) => [...prev, newProjectObj]);
      setNewProject({ name: "", members: [] });
    }
  }, [newProject, projects.length]);

  const handleLogin = useCallback(() => {
    const user = users.find(
      (u) => u.username === loginUsername && u.password === loginPassword
    );
    if (user) {
      setCurrentUser(user);
      setShowLoginDialog(false);
      setLoginUsername("");
      setLoginPassword("");
    } else {
      alert("ユーザー名またはパスワード間違っています。");
    }
  }, [loginUsername, loginPassword, users]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const handleFileShare = useCallback(() => {
    if (newFile) {
      const newSharedFile: SharedFile = {
        id: sharedFiles.length + 1,
        name: newFile.name,
        url: URL.createObjectURL(newFile),
        uploadedBy: currentUser ? currentUser.username : "ゲスト",
        uploadedAt: new Date(),
      };
      setSharedFiles((prev) => [...prev, newSharedFile]);
      setNewFile(null);
    }
  }, [newFile, sharedFiles.length, currentUser]);

  const generateReport = useCallback(() => {
    const currentProject = projects.find((p) => p.name === selectedProject);
    if (!currentProject) return null;

    const totalTasks = currentProject.tasks.length;
    const completedTasks = currentProject.tasks.filter(
      (t) => t.completed
    ).length;
    const progressPercentage =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const resourceUtilization = teamMembers.map((member) => {
      const memberTasks = tasks.filter(
        (task) =>
          task.assignee === member.name && task.project === selectedProject
      );
      return {
        name: member.name,
        tasksAssigned: memberTasks.length,
        tasksCompleted: memberTasks.filter((t) => t.completed).length,
      };
    });

    const budgetUsage = (expenses / budget) * 100;

    return {
      projectName: selectedProject,
      progress: progressPercentage.toFixed(2),
      totalTasks,
      completedTasks,
      resourceUtilization,
      budgetUsage: budgetUsage.toFixed(2),
      remainingBudget: (budget - expenses).toLocaleString(),
    };
  }, [projects, selectedProject, tasks, teamMembers, budget, expenses]);

  const exportGanttToExcel = useCallback(() => {
    const data = getGanttChartData;
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "GanttChart");
    XLSX.writeFile(wb, `${selectedProject}_GanttChart.xlsx`);
  }, [getGanttChartData, selectedProject]);

  const renderReport = useCallback(() => {
    const report = generateReport();
    if (!report) return null;

    return (
      <div className='space-y-4'>
        <h2 className='text-xl font-semibold'>
          プロジェクト: {report.projectName}
        </h2>
        <div>
          <h3 className='text-lg font-medium'>進捗状況</h3>
          <Progress
            value={parseFloat(report.progress)}
            className='w-full mt-2'
          />
          <p className='mt-1 text-sm text-gray-600'>
            完了タスク: {report.completedTasks} / 全タスク: {report.totalTasks}{" "}
            ({report.progress}%)
          </p>
        </div>
        <div>
          <h3 className='text-lg font-medium'>リソース利用状況</h3>
          <ul className='mt-2 space-y-2'>
            {report.resourceUtilization.map((resource, index) => (
              <li key={index} className='flex justify-between items-center'>
                <span>{resource.name}</span>
                <span>
                  {resource.tasksCompleted} / {resource.tasksAssigned}{" "}
                  タスク完了
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className='text-lg font-medium'>予算使用状況</h3>
          <Progress
            value={parseFloat(report.budgetUsage)}
            className='w-full mt-2'
          />
          <p className='mt-1 text-sm text-gray-600'>
            予算使用率: {report.budgetUsage}% (残り: {report.remainingBudget}円)
          </p>
        </div>
      </div>
    );
  }, [generateReport]);

  // 新しい関数: AI支援機能
  const getAiAssistance = useCallback(() => {
    // 実際のAI支援機能の実装はここで行います
    // この例では、ランダムなメッセージを返すだけの簡単な実装をしています
    const messages = [
      "タスクの優先順位を見直してみてはいかがでしょうか？",
      "チーム内のコミュニケーションを改善することで、プロジェクトの進行が円滑になる可能性があります。",
      "リスク管理を強化し、潜在的な問題に早めに対処することをお勧めします。",
      "定期的なプロジェクトレビューを実施することで、問題点を早期に見できるかもしれません。",
      "チームメンバーのスキルセットを最大限に活できているか確認してみましょう。",
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setAiAssistantMessage(randomMessage);
  }, []);

  // 新しい関数: AI分析
  const performAiAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    // 実際のAI分析の実装はここで行います
    // この例では、簡単な分析結果を生成するだけの実装をしています
    setTimeout(() => {
      const analysis = `
        プロジェクトの現状:
        ${projectStatus}

        問題点:
        ${projectIssues}

        分析結果:
        1. プロジェクトの進捗状況は${Math.floor(Math.random() * 100)}%です。
        2. リスクレベルは${
          ["低", "中", "高"][Math.floor(Math.random() * 3)]
        }です。
        3. チームの生産性は${Math.floor(Math.random() * 100)}%です。

        推奨アクション:
        - タスクの優先順位を見直す
        - チーム内のコミュニケーションを改善する
        - リスク管理を強化する
        - 定期的なプロジェクトレビューを実施する
        - チームメンバーのスキルセットを最大限に活用する

        これらのアクションを実施することで、プロジェクトの成功確率が向上すると予測されます。
      `;
      setAiAnalysisResult(analysis);
      setIsAnalyzing(false);
    }, 2000); // 2秒後に分析結果を表示
  }, [projectStatus, projectIssues]);

  // 新しい関数: ダッシュボード用のデータ生成
  const generateDashboardData = useCallback(() => {
    const currentProject = projects.find((p) => p.name === selectedProject);
    if (!currentProject) return null;

    const totalTasks = tasks.filter(
      (t) => t.project === selectedProject
    ).length;
    const completedTasks = tasks.filter(
      (t) => t.project === selectedProject && t.completed
    ).length;
    const inProgressTasks = tasks.filter(
      (t) => t.project === selectedProject && t.status === "対応中"
    ).length;
    const notStartedTasks = tasks.filter(
      (t) => t.project === selectedProject && t.status === "未着手"
    ).length;

    const tasksByPriority = {
      高: tasks.filter(
        (t) => t.project === selectedProject && t.priority === "高"
      ).length,
      中: tasks.filter(
        (t) => t.project === selectedProject && t.priority === "中"
      ).length,
      低: tasks.filter(
        (t) => t.project === selectedProject && t.priority === "低"
      ).length,
    };

    const tasksByType = taskTypes.reduce((acc, type) => {
      acc[type] = tasks.filter(
        (t) => t.project === selectedProject && t.type === type
      ).length;
      return acc;
    }, {} as Record<TaskType, number>);

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      notStartedTasks,
      tasksByPriority,
      tasksByType,
    };
  }, [projects, selectedProject, tasks]);

  return (
    <div className='flex flex-col h-screen'>
      <header className='bg-white shadow-sm'>
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
          <h1 className='text-2xl font-bold text-gray-900'>
            なんかいい名前あれば
          </h1>
          <div className='flex items-center space-x-4'>
            <Button
              variant={activePage === "calendar" ? "default" : "ghost"}
              size='sm'
              onClick={() => setActivePage("calendar")}
            >
              <CalendarIcon className='w-4 h-4 mr-2' />
              カレンダー
            </Button>
            {currentUser ? (
              <div className='flex items-center space-x-4'>
                <span className='text-sm text-gray-700'>
                  ようこそ、{currentUser.username}さん
                </span>
                <Button onClick={handleLogout} variant='outline' size='sm'>
                  <LogOut className='w-4 h-4 mr-2' />
                  ログアウト
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowLoginDialog(true)}
                variant='outline'
                size='sm'
              >
                <LogIn className='w-4 h-4 mr-2' />
                ログイン
              </Button>
            )}
          </div>
        </div>
      </header>
      <div className='flex flex-1 overflow-hidden'>
        <div className='w-64 bg-gray-100 h-screen p-4 flex flex-col'>
          <h2 className='text-2xl font-bold mb-4'>プロジェクト</h2>
          <Select
            onValueChange={(value) => {
              const sorted = [...projects].sort((a, b) => {
                if (value === "name") return a.name.localeCompare(b.name);
                if (value === "tasks") return b.tasks.length - a.tasks.length;
                return 0;
              });
              setProjects(sorted);
            }}
          >
            <SelectTrigger className='w-full mb-2'>
              <SelectValue placeholder='プロジェクトを並べ替え' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='name'>名前順</SelectItem>
              <SelectItem value='tasks'>タスク数順</SelectItem>
            </SelectContent>
          </Select>
          <ul className='space-y-2'>
            {projects.map((project) => (
              <li key={project.id}>
                <Button
                  variant={
                    selectedProject === project.name ? "default" : "ghost"
                  }
                  className='w-full justify-start'
                  onClick={() => setSelectedProject(project.name)}
                >
                  <Folder className='w-4 h-4 mr-2' />
                  {project.name}
                </Button>
              </li>
            ))}
          </ul>
          <Button
            onClick={() => setShowNewProjectDialog(true)}
            className='w-full mt-2 mb-4'
            variant='outline'
          >
            <PlusCircle className='w-4 h-4 mr-2' />
            新規プロジェクト
          </Button>
        </div>
        <div className='flex-1 overflow-auto p-4'>
          <h1 className='text-3xl font-bold mb-6'>{selectedProject}</h1>
          <div className='flex justify-between items-center mb-4'>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline'>
                  <Bell className='w-4 h-4 mr-2' />
                  通知 ({notifications.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>通知</DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className='flex items-center space-x-2'
                    >
                      {notification.type === "deadline" ? (
                        <CalendarIcon className='w-4 h-4' />
                      ) : (
                        <MessageSquare className='w-4 h-4' />
                      )}
                      <span>{notification.message}</span>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Tabs
            defaultValue='overview'
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as TabValue)}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-7 mb-4'>
              <TabsTrigger value='overview'>
                <Home className='w-4 h-4 mr-2' />
                概要
              </TabsTrigger>
              <TabsTrigger value='dashboard'>
                <PieChart className='w-4 h-4 mr-2' />
                ダッシュボード
              </TabsTrigger>
              <TabsTrigger value='tasks'>
                <List className='w-4 h-4 mr-2' />
                タスク
              </TabsTrigger>
              <TabsTrigger value='gantt'>
                <BarChart2 className='w-4 h-4 mr-2' />
                ガントチャート
              </TabsTrigger>
              <TabsTrigger value='files'>
                <FileUp className='w-4 h-4 mr-2' />
                ファイル共有
              </TabsTrigger>
              <TabsTrigger value='discussions'>
                <MessageCircle className='w-4 h-4 mr-2' />
                ディスカッション
              </TabsTrigger>
              <TabsTrigger value='ai'>
                <Brain className='w-4 h-4 mr-2' />
                AI分析
              </TabsTrigger>
            </TabsList>
            <TabsContent value='overview'>
              <Card>
                <CardHeader>
                  <CardTitle>プロジェクト概要</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderReport()}
                  <Textarea
                    placeholder='プロジェクトメモ'
                    value={
                      projects.find((p) => p.name === selectedProject)?.notes ||
                      ""
                    }
                    onChange={(e) => {
                      const updatedProjects = projects.map((p) =>
                        p.name === selectedProject
                          ? { ...p, notes: e.target.value }
                          : p
                      );
                      setProjects(updatedProjects);
                    }}
                    className='mt-4'
                  />
                  <div className='mt-4'>
                    <h3 className='text-lg font-medium mb-2'>AI支援</h3>
                    <Button onClick={getAiAssistance}>AI支援を受ける</Button>
                    {aiAssistantMessage && (
                      <div className='mt-2 p-4 bg-blue-100 rounded-lg'>
                        <p className='text-sm text-blue-800'>
                          {aiAssistantMessage}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='dashboard'>
              <Card>
                <CardHeader>
                  <CardTitle>プロジェクトダッシュボード</CardTitle>
                  <CardDescription>
                    {selectedProject}の進捗状況を視覚化します
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const dashboardData = generateDashboardData();
                    if (!dashboardData) return <p>データがありません</p>;

                    return (
                      <div className='space-y-6'>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                          <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                              <CardTitle className='text-sm font-medium'>
                                全タスク
                              </CardTitle>
                              <List className='h-4 w-4 text-muted-foreground' />
                            </CardHeader>
                            <CardContent>
                              <div className='text-2xl font-bold'>
                                {dashboardData.totalTasks}
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                              <CardTitle className='text-sm font-medium'>
                                完了タスク
                              </CardTitle>
                              <CheckCircle2 className='h-4 w-4 text-muted-foreground' />
                            </CardHeader>
                            <CardContent>
                              <div className='text-2xl font-bold'>
                                {dashboardData.completedTasks}
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                              <CardTitle className='text-sm font-medium'>
                                進行中タスク
                              </CardTitle>
                              <TrendingUp className='h-4 w-4 text-muted-foreground' />
                            </CardHeader>
                            <CardContent>
                              <div className='text-2xl font-bold'>
                                {dashboardData.inProgressTasks}
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                              <CardTitle className='text-sm font-medium'>
                                未着手タスク
                              </CardTitle>
                              <AlertTriangle className='h-4 w-4 text-muted-foreground' />
                            </CardHeader>
                            <CardContent>
                              <div className='text-2xl font-bold'>
                                {dashboardData.notStartedTasks}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                          <Card>
                            <CardHeader>
                              <CardTitle>タスク優先度分布</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Chart
                                width={"100%"}
                                height={"300px"}
                                chartType='PieChart'
                                loader={<div>Loading Chart</div>}
                                data={[
                                  ["優先度", "タスク数"],
                                  ...Object.entries(
                                    dashboardData.tasksByPriority
                                  ),
                                ]}
                                options={{
                                  title: "タスク優先度分布",
                                  pieHole: 0.4,
                                }}
                              />
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader>
                              <CardTitle>タスクタイプ分布</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Chart
                                width={"100%"}
                                height={"300px"}
                                chartType='BarChart'
                                loader={<div>Loading Chart</div>}
                                data={[
                                  ["タスクタイプ", "タスク数"],
                                  ...Object.entries(dashboardData.tasksByType),
                                ]}
                                options={{
                                  title: "タスクタイプ分布",
                                  legend: { position: "none" },
                                }}
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='tasks'>
              <Card>
                <CardHeader>
                  <CardTitle>タスク管理</CardTitle>
                  <CardDescription>
                    {selectedProject}のタスクを管理します
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex space-x-2 mb-4'>
                    <Input
                      type='text'
                      placeholder='新しいタスクを入力'
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                    />
                    <Button onClick={addTask}>
                      <PlusCircle className='w-4 h-4 mr-2' />
                      追加
                    </Button>
                  </div>
                  <div className='flex space-x-2 mb-4'>
                    <Select
                      value={taskFilter.assignee}
                      onValueChange={(value) =>
                        setTaskFilter({ ...taskFilter, assignee: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='担当者でフィルタ' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>全て</SelectItem>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={taskFilter.priority}
                      onValueChange={(value) =>
                        setTaskFilter({ ...taskFilter, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='優先度でフィルタ' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>全て</SelectItem>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={taskFilter.type}
                      onValueChange={(value) =>
                        setTaskFilter({ ...taskFilter, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='タイプでフィルタ' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>全て</SelectItem>
                        {taskTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() =>
                        setTaskFilter({
                          assignee: "all",
                          priority: "all",
                          status: "all",
                          type: "all",
                        })
                      }
                    >
                      <Filter className='w-4 h-4 mr-2' />
                      リセット
                    </Button>
                  </div>
                  <div className='flex space-x-4'>
                    {renderTaskColumn("未着手")}
                    {renderTaskColumn("対応中")}
                    {renderTaskColumn("完了")}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='gantt'>
              <Card>
                <CardHeader>
                  <CardTitle>ガントチャート</CardTitle>
                  <CardDescription>
                    {selectedProject}のタイムライン
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Chart
                    width={"100%"}
                    height={"400px"}
                    chartType='Gantt'
                    loader={<div>Loading Chart</div>}
                    data={getGanttChartData}
                    options={{
                      height: 400,
                      gantt: {
                        trackHeight: 30,
                        criticalPathEnabled: true,
                        criticalPathStyle: {
                          stroke: "#e64a19",
                          strokeWidth: 2,
                        },
                      },
                    }}
                  />
                  <Button onClick={exportGanttToExcel} className='mt-4'>
                    <Download className='w-4 h-4 mr-2' />
                    エクセルでエクスポート
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='files'>
              <Card>
                <CardHeader>
                  <CardTitle>ファイル共有</CardTitle>
                  <CardDescription>
                    {selectedProject}のファイルを共有します
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex space-x-2 mb-4'>
                    <Input
                      type='file'
                      onChange={(e) =>
                        setNewFile(e.target.files ? e.target.files[0] : null)
                      }
                    />
                    <Button onClick={handleFileShare}>
                      <FileUp className='w-4 h-4 mr-2' />
                      アップロード
                    </Button>
                  </div>
                  <div className='space-y-2'>
                    {sharedFiles.map((file) => (
                      <div
                        key={file.id}
                        className='flex items-center justify-between bg-gray-100 p-2 rounded'
                      >
                        <span>{file.name}</span>
                        <a
                          href={file.url}
                          download
                          className='text-blue-500 hover:underline'
                        >
                          ダウンロード
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='discussions'>
              <Card>
                <CardHeader>
                  <CardTitle>ディスカッションボード</CardTitle>
                  <CardDescription>
                    {selectedProject}に関するディスカッションを行います
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {discussions
                      .filter(
                        (d) =>
                          d.projectId ===
                          projects.find((p) => p.name === selectedProject)?.id
                      )
                      .map((discussion) => (
                        <div
                          key={discussion.id}
                          className='bg-gray-100 p-4 rounded-lg'
                        >
                          <div className='flex items-center justify-between mb-2'>
                            <span className='font-semibold'>
                              {discussion.author}
                            </span>
                            <span className='text-sm text-gray-500'>
                              {discussion.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <p>{discussion.content}</p>
                        </div>
                      ))}
                  </div>
                  <div className='mt-4'>
                    <Textarea
                      placeholder='新しいコメントを入力'
                      value={newDiscussion}
                      onChange={(e) => setNewDiscussion(e.target.value)}
                      className='mb-2'
                    />
                    <Button onClick={addDiscussion}>
                      <MessageSquare className='w-4 h-4 mr-2' />
                      コメントを追加
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='ai'>
              <Card>
                <CardHeader>
                  <CardTitle>AI分析</CardTitle>
                  <CardDescription>
                    {selectedProject}のAI分析を表示します
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div>
                      <label
                        htmlFor='projectStatus'
                        className='block text-sm font-medium text-gray-700'
                      >
                        プロジェクトの現状
                      </label>
                      <Textarea
                        id='projectStatus'
                        value={projectStatus}
                        onChange={(e) => setProjectStatus(e.target.value)}
                        placeholder='プロジェクトの現在の状況を入力してください'
                        className='mt-1'
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='projectIssues'
                        className='block text-sm font-medium text-gray-700'
                      >
                        問題点
                      </label>
                      <Textarea
                        id='projectIssues'
                        value={projectIssues}
                        onChange={(e) => setProjectIssues(e.target.value)}
                        placeholder='現在直面している問題点を入力してください'
                        className='mt-1'
                      />
                    </div>
                    <Button onClick={performAiAnalysis} disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>
                          <Loader className='w-4 h-4 mr-2 animate-spin' />
                          分析中...
                        </>
                      ) : (
                        <>
                          <Brain className='w-4 h-4 mr-2' />
                          AI分析を実行
                        </>
                      )}
                    </Button>
                    {aiAnalysisResult && (
                      <div className='mt-4 p-4 bg-gray-100 rounded-lg'>
                        <h3 className='text-lg font-medium mb-2'>AI分析結果</h3>
                        <pre className='whitespace-pre-wrap text-sm'>
                          {aiAnalysisResult}
                        </pre>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog
        open={selectedTask !== null}
        onOpenChange={() => setSelectedTask(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>タスク詳細</DialogTitle>
            <DialogDescription>
              タスクの詳細情報を確認・編集できます
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='taskTitle'
                  className='block text-sm font-medium text-gray-700'
                >
                  タスク名
                </label>
                <Input
                  id='taskTitle'
                  value={selectedTask.title}
                  onChange={(e) =>
                    setSelectedTask({ ...selectedTask, title: e.target.value })
                  }
                  placeholder='タスクタイトル'
                />
              </div>
              <div>
                <label
                  htmlFor='taskDescription'
                  className='block text-sm font-medium text-gray-700'
                >
                  タスクの説明
                </label>
                <Textarea
                  id='taskDescription'
                  value={selectedTask.description}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      description: e.target.value,
                    })
                  }
                  placeholder='タスクの説明'
                />
              </div>
              <div>
                <label
                  htmlFor='taskAssignee'
                  className='block text-sm font-medium text-gray-700'
                >
                  担当者
                </label>
                <Select
                  value={selectedTask.assignee}
                  onValueChange={(value) =>
                    setSelectedTask({ ...selectedTask, assignee: value })
                  }
                >
                  <SelectTrigger id='taskAssignee'>
                    <SelectValue placeholder='担当者を選択' />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor='taskPriority'
                  className='block text-sm font-medium text-gray-700'
                >
                  優先度
                </label>
                <Select
                  value={selectedTask.priority}
                  onValueChange={(value) =>
                    setSelectedTask({
                      ...selectedTask,
                      priority: value as Priority,
                    })
                  }
                >
                  <SelectTrigger id='taskPriority'>
                    <SelectValue placeholder='優先を選択' />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor='taskStatus'
                  className='block text-sm font-medium text-gray-700'
                >
                  ステータス
                </label>
                <Select
                  value={selectedTask.status}
                  onValueChange={(value) =>
                    setSelectedTask({
                      ...selectedTask,
                      status: value as TaskStatus,
                      completed: value === "完了",
                    })
                  }
                >
                  <SelectTrigger id='taskStatus'>
                    <SelectValue placeholder='ステータスを選択' />
                  </SelectTrigger>
                  <SelectContent>
                    {taskStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor='taskType'
                  className='block text-sm font-medium text-gray-700'
                >
                  タスクタイプ
                </label>
                <Select
                  value={selectedTask.type}
                  onValueChange={(value) =>
                    setSelectedTask({
                      ...selectedTask,
                      type: value as TaskType,
                    })
                  }
                >
                  <SelectTrigger id='taskType'>
                    <SelectValue placeholder='タスクタイプを選択' />
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor='taskStartDate'
                  className='block text-sm font-medium text-gray-700'
                >
                  開始日
                </label>
                <Input
                  id='taskStartDate'
                  type='date'
                  value={selectedTask.startDate.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      startDate: new Date(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor='taskDueDate'
                  className='block text-sm font-medium text-gray-700'
                >
                  期限日
                </label>
                <Input
                  id='taskDueDate'
                  type='date'
                  value={selectedTask.dueDate.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      dueDate: new Date(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor='taskAttachments'
                  className='block text-sm font-medium text-gray-700'
                >
                  添付ファイル
                </label>
                <Input
                  id='taskAttachments'
                  type='file'
                  onChange={(e) => handleFileUpload(e, selectedTask.id)}
                />
                <ul className='mt-2 space-y-1'>
                  {selectedTask.attachments.map((attachment, index) => (
                    <li key={index} className='text-sm text-gray-600'>
                      {attachment}
                    </li>
                  ))}
                </ul>
              </div>
              <DialogFooter>
                <Button onClick={() => updateTask(selectedTask)}>更新</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ログイン</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium text-gray-700'
              >
                ユーザー名
              </label>
              <Input
                id='username'
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder='ユーザー名'
              />
            </div>
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                パスワード
              </label>
              <Input
                id='password'
                type='password'
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder='パスワード'
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleLogin}>ログイン</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新規プロジェクト作成</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <label
                htmlFor='projectName'
                className='block text-sm font-medium text-gray-700'
              >
                プロジェクト名
              </label>
              <Input
                id='projectName'
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                placeholder='プロジェクト名'
              />
            </div>
            <div>
              <label
                htmlFor='projectMembers'
                className='block text-sm font-medium text-gray-700'
              >
                メンバー
              </label>
              <Select
                value={newProject.members.join(",")}
                onValueChange={(value) =>
                  setNewProject({
                    ...newProject,
                    members: [...newProject.members, value],
                  })
                }
              >
                <SelectTrigger id='projectMembers'>
                  <SelectValue placeholder='メンバーを選択' />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.name}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ul className='mt-2 space-y-1'>
                {newProject.members.map((member, index) => (
                  <li key={index} className='text-sm text-gray-600'>
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addProject}>作成</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
