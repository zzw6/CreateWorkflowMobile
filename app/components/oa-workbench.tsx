"use client"

import { useState, useMemo } from "react"
import {
  Search, FileText, ClipboardList, Clock, Mail, Plane, Lamp,
  MessageSquare, ShieldCheck, ArrowLeftRight, UserCheck, Building2,
  BookOpen, GraduationCap, UserPlus, Briefcase,
  Car, CreditCard, PackageCheck, Users, ScrollText, Handshake,
  Star, Settings, Bell, Calendar, BarChart2, ChevronRight,
  type LucideIcon
} from "lucide-react"
import { Input } from "@/components/ui/input"
import '@/lib/openLink'

interface WfBean {
  id: string
  name: string
  spell: string
}

interface Category {
  id: string
  typeName: string
  color: string
  wfbeans: WfBean[]
}

interface User {
  name: string
  department: string
  avatar: string
  todoCount: number
  doneCount: number
  ccCount: number
}

// ─── 图标映射 ─────────────────────────────────────────────
const iconRules: Array<{ keywords: string[]; Icon: LucideIcon }> = [
  { keywords: ["审批", "oa"], Icon: ClipboardList },
  { keywords: ["请假", "假"], Icon: Clock },
  { keywords: ["邮箱", "邮件", "收文"], Icon: Mail },
  { keywords: ["出差", "行驶", "外出"], Icon: Plane },
  { keywords: ["加班"], Icon: Lamp },
  { keywords: ["资质", "资源", "公司"], Icon: MessageSquare },
  { keywords: ["vpn", "账户", "安全"], Icon: ShieldCheck },
  { keywords: ["离职", "交接"], Icon: ArrowLeftRight },
  { keywords: ["转正"], Icon: UserCheck },
  { keywords: ["购置", "请购", "采购"], Icon: PackageCheck },
  { keywords: ["培训", "云课堂", "学习", "教育", "考核"], Icon: GraduationCap },
  { keywords: ["入职", "招聘", "新员工"], Icon: UserPlus },
  { keywords: ["合同", "协议", "合规", "合作"], Icon: ScrollText },
  { keywords: ["费用", "报销", "财务", "借款", "付款"], Icon: CreditCard },
  { keywords: ["人事", "人力", "员工", "调岗"], Icon: Users },
  { keywords: ["系统", "设备", "权限"], Icon: Settings },
  { keywords: ["通知", "公告"], Icon: Bell },
  { keywords: ["日程", "计划"], Icon: Calendar },
  { keywords: ["报告", "分析", "统计", "评价"], Icon: BarChart2 },
  { keywords: ["外派", "派遣"], Icon: Briefcase },
  { keywords: ["物业", "土地", "收购"], Icon: Building2 },
  { keywords: ["签约"], Icon: Handshake },
  { keywords: ["用车", "车辆", "车"], Icon: Car },
  { keywords: ["制度", "文档", "文件"], Icon: BookOpen },
  { keywords: ["印章"], Icon: Star },
  { keywords: ["账户", "vpn"], Icon: ShieldCheck },
  { keywords: ["技能", "认证", "资质"], Icon: Star },
]

function getIcon(name: string): LucideIcon {
  const lower = name.toLowerCase()
  for (const rule of iconRules) {
    if (rule.keywords.some((k) => lower.includes(k))) return rule.Icon
  }
  return FileText
}

// ─── 工作流图标 ──────────────────────────────────────────
function AppIcon({
  name,
  item,
  icon,
  color,
}: {
  name: string
  item: WfBean
  icon: string
  color: string
}) {
  const Icon = getIcon(name)

  const handleClick = () => {
    if (typeof window !== "undefined" && (window as any).openLink) {
      (window as any).openLink.openWorkflow(
        "/mobile/workflow/index/list/todo/newflow/flowpage/create/" + item.id
      )
    }
  }

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform duration-100 focus:outline-none"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
        style={{ backgroundColor: color + "18" }}
      >
        {icon ? (
          <img
            src={icon}
            alt={name}
            className="w-8 h-8 object-contain"
          />
        ) : (
          <Icon
            style={{ width: 26, height: 26, color: color }}
            strokeWidth={1.7}
          />
        )}
      </div>
      <span className="text-[11px] text-gray-500 text-center leading-tight w-14 wf-title">
        {name}
      </span>
    </button>
  )
}

// ─── 图标网格 ─────────────────────────────────────────────
function AppGrid({
  items,
  color,
  wfIcons,
}: {
  items: WfBean[]
  color: string
  wfIcons: Record<string, string>
}) {
  const [expanded, setExpanded] = useState(false)
  const LIMIT = 8
  const showExpand = items.length > LIMIT
  const visibleItems = expanded ? items : items.slice(0, LIMIT)
  const cols = 4
  const remainder = visibleItems.length % cols
  const padding = remainder === 0 ? 0 : cols - remainder

  return (
    <div>
      <div className="grid grid-cols-4 gap-y-4 gap-x-1">
        {visibleItems.map((item) => (
          <AppIcon
            key={item.id}
            name={item.name}
            item={item}
            icon={wfIcons?.[item.id] ?? ""}
            color={color}
          />
        ))}
        {Array.from({ length: padding }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
      </div>
      {showExpand && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-gray-400 py-1"
        >
          {expanded ? "收起" : `查看全部 ${items.length} 个`}
          <ChevronRight
            className={`w-3 h-3 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
          />
        </button>
      )}
    </div>
  )
}

// ─── 统计徽章 ─────────────────────────────────────────────
function StatBadge({
  label,
  count,
  color,
}: {
  label: string
  count: number
  color: string
}) {
  return (
    <div className="flex-1 flex flex-col items-center gap-0.5">
      <span className="text-xl font-bold" style={{ color }}>
        {count}
      </span>
      <span className="text-xs text-white/70">{label}</span>
    </div>
  )
}

// ─── 顶部 Header ──────────────────────────────────────────
function Header({ user }: { user: User }) {
  return (
    <div
      className="relative px-4 pt-12 pb-6"
      style={{
        background: "linear-gradient(135deg, #1a9fd8 0%, #0d7ab5 100%)",
      }}
    >
      {/* 用户信息 */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-base">
            {user.avatar}
          </div>
          <div>
            <p className="text-white font-semibold text-base leading-tight">
              {user.name}
            </p>
            <p className="text-white/65 text-xs">{user.department}</p>
          </div>
        </div>
        <button className="relative w-8 h-8 flex items-center justify-center">
          <Bell className="w-5 h-5 text-white/80" strokeWidth={1.8} />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-400 rounded-full" />
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="bg-white/15 rounded-2xl px-4 py-3 flex items-center divide-x divide-white/20">
        <StatBadge label="待办" count={user.todoCount} color="#fff" />
        <StatBadge label="已办" count={user.doneCount} color="#fff" />
        <StatBadge label="抄送" count={user.ccCount} color="#fff" />
      </div>

      {/* 底部圆弧装饰 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-5 bg-[#f0f6fb]"
        style={{ borderRadius: "20px 20px 0 0" }}
      />
    </div>
  )
}

// ─── 快捷操作 ─────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "我的待办", Icon: ClipboardList, color: "#1a9fd8" },
  { label: "我发起的", Icon: FileText, color: "#B37BFA" },
  { label: "已办事项", Icon: Star, color: "#36C78D" },
  { label: "通知公告", Icon: Bell, color: "#FF7A4D" },
]

function QuickActions() {
  return (
    <div className="mx-4 mb-3 bg-white rounded-2xl p-3 shadow-sm border border-[#e8f3fb]">
      <div className="grid grid-cols-4 gap-2">
        {QUICK_ACTIONS.map(({ label, Icon, color }) => (
          <button
            key={label}
            className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: color + "15" }}
            >
              <Icon style={{ width: 22, height: 22, color }} strokeWidth={1.8} />
            </div>
            <span className="text-[11px] text-gray-500">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── 通知横幅 ─────────────────────────────────────────────
function NoticeBanner({ notices }: { notices: string[] }) {
  const [idx, setIdx] = useState(0)
  return (
    <div
      className="mx-4 mb-3 bg-white rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm border border-[#e8f3fb]"
    >
      <div className="flex-shrink-0 bg-[#1a9fd8]/10 rounded-md px-1.5 py-0.5">
        <span className="text-[10px] font-semibold text-[#1a9fd8]">公告</span>
      </div>
      <p
        className="flex-1 text-xs text-gray-500 truncate cursor-pointer"
        onClick={() => setIdx((i) => (i + 1) % notices.length)}
      >
        {notices[idx]}
      </p>
      <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
    </div>
  )
}

// ─── 主组件 ───────────────────────────────────────────────
export default function OAWorkbench({
  data = [],
  wfIcons = {},
  user,
}: {
  data?: Category[]
  wfIcons?: Record<string, string>
  user?: User
}) {
  const [keyword, setKeyword] = useState("")

  const defaultUser: User = {
    name: "用户",
    department: "未知部门",
    avatar: "用",
    todoCount: 0,
    doneCount: 0,
    ccCount: 0,
  }

  const currentUser = user ?? defaultUser

  const filteredData = useMemo(() => {
    const q = keyword.trim().toLowerCase()
    if (!q) return data
    return data
      .map((category) => ({
        ...category,
        wfbeans: category.wfbeans.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.spell.toLowerCase().includes(q)
        ),
      }))
      .filter((category) => category.wfbeans.length > 0)
  }, [keyword, data])

  const mockNotices = [
    "关于2025年春节放假安排的通知",
    "关于加强信息安全管理的通知",
    "关于Q4绩效考核工作安排",
  ]

  return (
    <div className="min-h-screen bg-[#f0f6fb]">
      {/* 顶部 */}
      <Header user={currentUser} />

      {/* 搜索栏 */}
      <div className="px-4 pt-3 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a9fd8]" />
          <Input
            placeholder="搜索功能"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-white rounded-xl border border-[#daeef8] text-sm placeholder:text-gray-400 text-gray-700 focus-visible:ring-1 focus-visible:ring-[#1a9fd8]/40 shadow-sm"
          />
        </div>
      </div>

      {/* 快捷操作 & 公告（只在未搜索时显示） */}
      {!keyword && (
        <>
          <QuickActions />
          <NoticeBanner notices={mockNotices} />
        </>
      )}

      {/* 分区标题（搜索时显示） */}
      {keyword && (
        <div className="px-4 pb-1">
          <p className="text-xs text-gray-400">
            搜索「{keyword}」的结果（{filteredData.reduce((s, c) => s + c.wfbeans.length, 0)} 个）
          </p>
        </div>
      )}

      {/* 各分类卡片 */}
      {filteredData.length === 0 ? (
        <div className="mx-4 mt-10 flex flex-col items-center text-gray-300 gap-3">
          <Search className="w-12 h-12 opacity-40" />
          <span className="text-sm">未找到相关功能</span>
        </div>
      ) : (
        <div className="px-4 flex flex-col gap-3 pb-8">
          {filteredData.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl p-4 bg-white border border-[#e8f3fb] shadow-sm"
            >
              {/* 分类标题 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-1 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <h2 className="text-sm font-semibold text-gray-700 wf-group-title">
                    {category.typeName}
                  </h2>
                  <span
                    className="text-[10px] rounded-full px-1.5 py-0.5 font-medium"
                    style={{
                      backgroundColor: category.color + "15",
                      color: category.color,
                    }}
                  >
                    {category.wfbeans.length}
                  </span>
                </div>
              </div>

              {/* 图标网格 */}
              <AppGrid
                items={category.wfbeans}
                wfIcons={wfIcons}
                color={category.color}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
