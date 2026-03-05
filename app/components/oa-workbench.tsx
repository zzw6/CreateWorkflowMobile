"use client"

import { useState, useMemo } from "react"
import {
  Search, FileText, ClipboardList, Clock, Mail, Plane, Lamp,
  MessageSquare, ShieldCheck, ArrowLeftRight, UserCheck, Building2,
  BookOpen, GraduationCap, UserPlus, Briefcase,
  Car, CreditCard, PackageCheck, Users, ScrollText, Handshake,
  Star, Settings, Calendar, BarChart2, ChevronRight, ChevronDown,
  type LucideIcon
} from "lucide-react"
import { Input } from "@/components/ui/input"
import '@/lib/openLink'

// ── 主品牌色 ─────────────────────────────────────────────
const BRAND = "#2B3CC8"          // 深蓝主色
const BRAND_LIGHT = "#4F63E7"    // 略浅蓝
const BG_PAGE = "#EEF2FF"        // 页面底色（淡蓝紫）
const BG_HEADER_FROM = "#2B3CC8"
const BG_HEADER_TO = "#4F63E7"

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
  { keywords: ["日程", "计划"], Icon: Calendar },
  { keywords: ["报告", "分析", "统计", "评价"], Icon: BarChart2 },
  { keywords: ["外派", "派遣"], Icon: Briefcase },
  { keywords: ["物业", "土地", "收购"], Icon: Building2 },
  { keywords: ["签约"], Icon: Handshake },
  { keywords: ["用车", "车辆", "车"], Icon: Car },
  { keywords: ["制度", "文档", "文件"], Icon: BookOpen },
  { keywords: ["印章", "技能", "认证"], Icon: Star },
]

function getIcon(name: string): LucideIcon {
  const lower = name.toLowerCase()
  for (const rule of iconRules) {
    if (rule.keywords.some((k) => lower.includes(k))) return rule.Icon
  }
  return FileText
}

// ─── 工作流图标按钮 ───────────────────────────────────────
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
        className="w-13 h-13 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: color + "1A" }}
      >
        {icon ? (
          <img src={icon} alt={name} className="w-7 h-7 object-contain" />
        ) : (
          <Icon style={{ width: 24, height: 24, color }} strokeWidth={1.7} />
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
          className="mt-3 w-full flex items-center justify-center gap-1 text-xs py-1"
          style={{ color: BRAND_LIGHT }}
        >
          {expanded ? "收起" : `查看全部 ${items.length} 个`}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  )
}

// ─── 统计项 ───────────────────────────────────────────────
function StatItem({
  label,
  count,
  iconBg,
  Icon,
}: {
  label: string
  count: number
  iconBg: string
  Icon: LucideIcon
}) {
  return (
    <div className="flex-1 flex flex-col items-center gap-2">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center shadow-md"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xl font-bold text-white leading-none tabular-nums">
          {count}
        </span>
        <span className="text-[11px] text-white/60 leading-none">{label}</span>
      </div>
    </div>
  )
}

// ─── 顶部 Header ──────────────────────────────────────────
function Header({ user }: { user: User }) {
  return (
    <div
      className="relative px-4 pt-12 pb-8 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${BG_HEADER_FROM} 0%, ${BG_HEADER_TO} 100%)`,
      }}
    >
      {/* 装饰大圆 — 右上 */}
      <div
        className="absolute -top-10 -right-10 w-44 h-44 rounded-full"
        style={{ background: "rgba(255,255,255,0.07)" }}
      />
      {/* 装饰中圆 — 右中 */}
      <div
        className="absolute top-16 -right-6 w-28 h-28 rounded-full"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />
      {/* 装饰小圆 — 左下 */}
      <div
        className="absolute -bottom-6 -left-8 w-32 h-32 rounded-full"
        style={{ background: "rgba(255,255,255,0.05)" }}
      />
      {/* 装饰小圆点 — 左上 */}
      <div
        className="absolute top-6 left-24 w-5 h-5 rounded-full"
        style={{ background: "rgba(255,255,255,0.15)" }}
      />
      <div
        className="absolute top-14 left-10 w-3 h-3 rounded-full"
        style={{ background: "rgba(255,255,255,0.12)" }}
      />
      {/* 斜线光晕 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.04) 0%, transparent 60%)",
        }}
      />

      {/* 用户信息 */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center text-white font-semibold text-base border border-white/30">
            {user.avatar}
          </div>
          <div>
            <p className="text-white font-semibold text-base leading-tight">
              {user.name}
            </p>
            <p className="text-white/60 text-xs mt-0.5">{user.department}</p>
          </div>
        </div>
        <div className="bg-white/15 rounded-full px-3 py-1 flex items-center gap-1 border border-white/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-white/80 text-xs">在线</span>
        </div>
      </div>

      {/* 待办统计卡片 */}
      <div className="relative z-10 flex items-center justify-around">
        <StatItem label="待办" count={user.todoCount} iconBg="#F87171" Icon={ClipboardList} />
        <div className="w-px h-10 flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }} />
        <StatItem label="已办" count={user.doneCount} iconBg="#34D399" Icon={Star} />
        <div className="w-px h-10 flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }} />
        <StatItem label="抄送" count={user.ccCount} iconBg="#FBBF24" Icon={Mail} />
      </div>

      {/* 底部弧形过渡 — 与页面背景色一致 */}
      <svg
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        viewBox="0 0 390 24"
        preserveAspectRatio="none"
        style={{ height: 24 }}
      >
        <path d="M0 24 Q195 0 390 24 L390 24 L0 24 Z" fill={BG_PAGE} />
      </svg>
    </div>
  )
}

// ─── 快捷操作 ─────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "我的待办", Icon: ClipboardList, color: BRAND },
  { label: "我发起的", Icon: FileText, color: "#7C3AED" },
  { label: "已办事项", Icon: ClipboardList, color: "#059669" },
]

function QuickActions() {
  return (
    <div
      className="mx-4 mb-3 rounded-2xl p-3"
      style={{ background: "#fff", border: "1px solid #E0E7FF" }}
    >
      <div className="grid grid-cols-3 gap-2">
        {QUICK_ACTIONS.map(({ label, Icon, color }) => (
          <button
            key={label}
            className="flex flex-col items-center gap-2 py-1.5 active:scale-95 transition-transform"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: color + "18" }}
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

// ─── ���类卡片 ─────────────────────────────────────────────
function CategoryCard({
  category,
  wfIcons,
}: {
  category: Category
  wfIcons: Record<string, string>
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "#fff", border: "1px solid #E0E7FF" }}
    >
      {/* 标题行 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-4 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <h2 className="text-sm font-semibold text-gray-800 wf-group-title">
            {category.typeName}
          </h2>
          <span
            className="text-[10px] rounded-full px-1.5 py-0.5 font-medium leading-none"
            style={{
              backgroundColor: category.color + "18",
              color: category.color,
            }}
          >
            {category.wfbeans.length}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </div>

      <AppGrid
        items={category.wfbeans}
        wfIcons={wfIcons}
        color={category.color}
      />
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

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: BG_PAGE,
        backgroundImage:
          "radial-gradient(circle at 80% 10%, rgba(79,99,231,0.08) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(124,58,237,0.06) 0%, transparent 45%)",
      }}
    >
      {/* 装饰圆 — z-0 确保不遮挡内容 */}
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full z-0 pointer-events-none" style={{ background: "rgba(79,99,231,0.07)" }} />
      <div className="absolute top-1/2 -left-16 w-48 h-48 rounded-full z-0 pointer-events-none" style={{ background: "rgba(124,58,237,0.05)" }} />
      <div className="absolute top-1/3 -right-10 w-28 h-28 rounded-full z-0 pointer-events-none" style={{ background: "rgba(79,99,231,0.06)" }} />
      <div className="absolute top-64 left-6 w-4 h-4 rounded-full z-0 pointer-events-none" style={{ background: "rgba(79,99,231,0.12)" }} />
      <div className="absolute top-96 right-8 w-2.5 h-2.5 rounded-full z-0 pointer-events-none" style={{ background: "rgba(124,58,237,0.15)" }} />

      {/* 内容层 — z-10 确保始终在装饰圆之上 */}
      <div className="relative z-10">

      {/* 顶部 */}
      <Header user={currentUser} />

      {/* 搜索栏 */}
      <div className="px-4 pt-3 pb-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: BRAND_LIGHT }}
          />
          <Input
            placeholder="搜索功能"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl text-sm placeholder:text-gray-400 text-gray-700 shadow-sm focus-visible:ring-1"
            style={{
              background: "#fff",
              border: "1px solid #C7D2FE",
              // @ts-ignore
              "--tw-ring-color": BRAND_LIGHT + "66",
            }}
          />
        </div>
      </div>

      {/* 快捷操��（未搜索时显示） */}
      {!keyword && <QuickActions />}

      {/* 搜索结果提示 */}
      {keyword && (
        <div className="px-4 pb-1">
          <p className="text-xs text-gray-400">
            搜索「{keyword}」的结果（{filteredData.reduce((s, c) => s + c.wfbeans.length, 0)} 个）
          </p>
        </div>
      )}

      {/* 分类列表 */}
      {filteredData.length === 0 ? (
        <div className="mx-4 mt-16 flex flex-col items-center gap-3" style={{ color: "#C7D2FE" }}>
          <Search className="w-12 h-12 opacity-50" />
          <span className="text-sm text-gray-400">未找到相关功能</span>
        </div>
      ) : (
        <div className="px-4 flex flex-col gap-3 pb-10">
          {filteredData.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              wfIcons={wfIcons}
            />
          ))}
        </div>
      )}

      </div>{/* end z-10 wrapper */}
    </div>
  )
}
