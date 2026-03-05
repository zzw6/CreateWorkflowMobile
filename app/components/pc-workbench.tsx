"use client"

import { useState, useMemo } from "react"
import {
  Search, Plus, FileText, BookOpen, GraduationCap, UserPlus, HelpCircle,
  ClipboardList, Clock, Mail, Plane, Lamp, MessageSquare, ShieldCheck,
  LogOut, UserCheck, Building2, ArrowLeftRight, Briefcase, Car, CreditCard,
  PackageCheck, Users, ScrollText, Handshake, Star, Settings, Bell,
  Calendar, BarChart2, type LucideIcon
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import DualColorIcon from "@/app/components/dual-color-icon"

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

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const iconRules: Array<{ keywords: string[]; Icon: LucideIcon }> = [
  { keywords: ["审批", "oa"], Icon: ClipboardList },
  { keywords: ["请假", "假"], Icon: Clock },
  { keywords: ["邮箱", "邮件", "收文"], Icon: Mail },
  { keywords: ["出差", "行驶", "车辆", "外出"], Icon: Plane },
  { keywords: ["加班"], Icon: Lamp },
  { keywords: ["资质", "资源", "公司"], Icon: MessageSquare },
  { keywords: ["vpn", "账户", "安全"], Icon: ShieldCheck },
  { keywords: ["离职", "交接"], Icon: ArrowLeftRight },
  { keywords: ["转正", "申请"], Icon: UserCheck },
  { keywords: ["购置", "请购", "采购"], Icon: PackageCheck },
  { keywords: ["培训", "云课堂", "学习", "教育"], Icon: GraduationCap },
  { keywords: ["入职", "招聘", "新员工"], Icon: UserPlus },
  { keywords: ["合同", "协议"], Icon: ScrollText },
  { keywords: ["岗位", "评价", "考核", "考评"], Icon: Star },
  { keywords: ["费用", "报销", "财务"], Icon: CreditCard },
  { keywords: ["人事", "人力", "员工"], Icon: Users },
  { keywords: ["维护", "系统", "管理制度"], Icon: Settings },
  { keywords: ["通知", "公告"], Icon: Bell },
  { keywords: ["日程", "计划"], Icon: Calendar },
  { keywords: ["报告", "分析", "统计"], Icon: BarChart2 },
  { keywords: ["外派", "派遣"], Icon: Briefcase },
  { keywords: ["物业", "土地", "收购"], Icon: Building2 },
  { keywords: ["合作", "签约"], Icon: Handshake },
  { keywords: ["车", "用车"], Icon: Car },
  { keywords: ["制度", "文档", "文件"], Icon: BookOpen },
]

function getIcon(name: string): LucideIcon {
  const lower = name.toLowerCase()
  for (const rule of iconRules) {
    if (rule.keywords.some((k) => lower.includes(k))) return rule.Icon
  }
  return FileText
}

const quickEntries = [
  { label: "公司管理制度", bg: "linear-gradient(135deg,#1a9fd8,#0e7abf)", Icon: BookOpen },
  { label: "学习教育中心", bg: "linear-gradient(135deg,#FF7A4D,#e85d2a)", Icon: GraduationCap },
  { label: "新员工入职指引", bg: "linear-gradient(135deg,#36C78D,#1fa36e)", Icon: UserPlus },
  { label: "系统帮助文档", bg: "linear-gradient(135deg,#B37BFA,#9458e8)", Icon: HelpCircle },
]

function getBadge(name: string): "star" | "check" | "dot" {
  const lower = name.toLowerCase()
  if (["审批", "转正", "合同", "协议", "考核", "评价"].some((k) => lower.includes(k))) return "check"
  if (["资质", "公司", "邮箱", "邮件"].some((k) => lower.includes(k))) return "dot"
  return "star"
}

function CategoryCard({ category, keyword }: { category: Category; keyword: string }) {
  const { typeName, color, wfbeans } = category
  const bg = hexToRgba(color, 0.08)

  return (
    <div className="rounded-xl flex overflow-hidden border border-[#daeef8] bg-white shadow-sm">
      {/* 左侧分类信息 */}
      <div
        className="w-44 flex-shrink-0 p-4 flex flex-col gap-2"
        style={{ backgroundColor: `rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},0.08)` }}
      >
        <div className="flex items-center gap-2">
          <DualColorIcon Icon={getIcon(typeName)} size="sm" badge={getBadge(typeName)} />
          <span className="text-sm font-semibold leading-tight" style={{ color }}>
            {typeName}
          </span>
        </div>
        <span className="text-xs text-gray-400 pl-0.5">共 {wfbeans.length} 个流程</span>
      </div>

      {/* 右侧流程列表 */}
      <div className="flex-1 p-3 flex flex-wrap gap-2 content-start border-l border-[#daeef8]">
        {wfbeans.map((item) => {
          const q = keyword.trim().toLowerCase()
          const matched =
            q &&
            (item.name.toLowerCase().includes(q) ||
              item.spell.toLowerCase().includes(q))
          return (
            <button
              key={item.id}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-sm transition-colors
                ${matched
                  ? "border border-[#1a9fd8] bg-[#e8f5fd] text-[#0e8fd8]"
                  : "border border-[#daeef8] bg-[#f4fafd] text-gray-600 hover:border-[#1a9fd8] hover:text-[#0e8fd8] hover:bg-[#e8f5fd]"
                }`}
            >
              <DualColorIcon Icon={getIcon(item.name)} size="sm" badge={getBadge(item.name)} />
              {item.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function PCWorkbench({ data }: { data: Category[] }) {
  const [keyword, setKeyword] = useState("")

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

  const totalFlows = data.reduce((acc, c) => acc + c.wfbeans.length, 0)

  return (
    <div className="min-h-screen bg-[#f0f6fb]">
      {/* 顶部导航栏 */}
      <header
        className="px-8 h-14 flex items-center justify-between border-b border-[#0a6db5]/20 shadow-sm"
        style={{ background: "linear-gradient(90deg, #0a6db5 0%, #1a9fd8 100%)" }}
      >
        <Button
          className="flex items-center gap-1.5 text-sm h-8 px-4 rounded-lg font-medium border-0"
          style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}
        >
          <Plus className="w-4 h-4" />
          新建流程
        </Button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0e8fd8]" />
            <Input
              placeholder="搜索流程或分类..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-64 h-8 pl-9 pr-4 bg-white rounded-lg border-0 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#0e8fd8] text-gray-700"
            />
          </div>
          <Button
            className="h-8 px-4 text-sm rounded-lg font-medium border-0"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }}
          >
            我的申请
          </Button>
        </div>
      </header>

      <main className="px-8 py-6 max-w-7xl mx-auto">
        {/* 快捷入口 */}
        {!keyword && (
          <section className="mb-6">
            <p className="text-sm text-[#5a7fa0] mb-3 font-medium">快捷入口</p>
            <div className="grid grid-cols-4 gap-4">
              {quickEntries.map(({ label, bg, Icon }) => (
                <button
                  key={label}
                  className="rounded-xl p-5 flex items-center gap-3 text-white font-medium text-base shadow hover:opacity-90 transition-opacity"
                  style={{ background: bg }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.22)" }}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 全部流程 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-0.5 h-4 rounded-full bg-[#0e8fd8] inline-block" />
              <p className="text-sm font-semibold text-[#1a4a6e]">全部流程</p>
            </div>
            {!keyword && (
              <p className="text-xs text-[#5a7fa0]">
                {data.length} 个分类 · {totalFlows} 个流程
              </p>
            )}
          </div>

          {filteredData.length === 0 ? (
            <div className="rounded-xl py-16 flex flex-col items-center gap-3 text-gray-400 border border-[#daeef8] bg-white shadow-sm">
              <Search className="w-10 h-10 opacity-30" />
              <span className="text-sm">未找到相关流程或分类</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredData.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  keyword={keyword}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
