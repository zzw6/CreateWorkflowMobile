"use client"

import {useState, useMemo} from "react"
import {
    Search, FileText, ClipboardList, Clock, Mail, Plane, Lamp,
    MessageSquare, ShieldCheck, LogOut, UserCheck, Building2,
    BookOpen, GraduationCap, UserPlus, ArrowLeftRight, Briefcase,
    Car, CreditCard, PackageCheck, Users, ScrollText, Handshake,
    Star, Settings, Bell, Calendar, BarChart2, type LucideIcon
} from "lucide-react"
import {Input} from "@/components/ui/input"
import DualColorIcon from "@/app/components/dual-color-icon"
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

function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha})`
}

const iconRules: Array<{ keywords: string[]; Icon: LucideIcon }> = [
    {keywords: ["审批", "oa"], Icon: ClipboardList},
    {keywords: ["请假", "假"], Icon: Clock},
    {keywords: ["邮箱", "邮件", "收文"], Icon: Mail},
    {keywords: ["出差", "行驶", "车辆", "外出"], Icon: Plane},
    {keywords: ["加班"], Icon: Lamp},
    {keywords: ["资质", "资源", "公司"], Icon: MessageSquare},
    {keywords: ["vpn", "账户", "安全"], Icon: ShieldCheck},
    {keywords: ["离职", "交接"], Icon: ArrowLeftRight},
    {keywords: ["转正", "申请"], Icon: UserCheck},
    {keywords: ["购置", "请购", "采购"], Icon: PackageCheck},
    {keywords: ["培训", "云课堂", "学习", "教育"], Icon: GraduationCap},
    {keywords: ["入职", "招聘", "新员工"], Icon: UserPlus},
    {keywords: ["合同", "协议"], Icon: ScrollText},
    {keywords: ["岗位", "评价", "考核", "考评"], Icon: Star},
    {keywords: ["费用", "报销", "财务"], Icon: CreditCard},
    {keywords: ["人事", "人力", "员工"], Icon: Users},
    {keywords: ["维护", "系统", "管理制度"], Icon: Settings},
    {keywords: ["通知", "公告"], Icon: Bell},
    {keywords: ["日程", "计划"], Icon: Calendar},
    {keywords: ["报告", "分析", "统计"], Icon: BarChart2},
    {keywords: ["外派", "派遣"], Icon: Briefcase},
    {keywords: ["物业", "土地", "收购"], Icon: Building2},
    {keywords: ["合作", "签约"], Icon: Handshake},
    {keywords: ["车", "用车"], Icon: Car},
    {keywords: ["制度", "文档", "文件"], Icon: BookOpen},
]

function getIcon(name: string): LucideIcon {
    const lower = name.toLowerCase()
    for (const rule of iconRules) {
        if (rule.keywords.some((k) => lower.includes(k))) return rule.Icon
    }
    return FileText
}

// badge 规则：部分流程用 check，其余用 star
function getBadge(name: string): "star" | "check" | "dot" {
    const lower = name.toLowerCase()
    if (["审批", "转正", "合同", "协议", "考核", "评价"].some((k) => lower.includes(k))) return "check"
    if (["资质", "公司", "邮箱", "邮件"].some((k) => lower.includes(k))) return "dot"
    return "star"
}

function AppIcon({name, item, icon}: { name: string; item: any; icon: string }) {
    const Icon = getIcon(name)
    const badge = getBadge(name)
    return (
        <div className="flex flex-col items-center gap-2" onClick={()=>{
            window.openLink.openWorkflow('/mobile/workflow/index/list/todo/newflow/flowpage/create/'+item.id);
        }}>
            <div>
                <img src={icon ? icon : '/api/secondev/zwxwf/default-icon.png'} style={{width: '56px'}}/>
            </div>
            <span className="text-xs text-gray-600 text-center leading-tight w-16 break-words wf-title">
                {name}
              </span>
        </div>
    )
}

function AppGrid({items, color, wfIcons}: { items: WfBean[]; color: string; wfIcons: any }) {
    const cols = 4
    const remainder = items.length % cols
    const padding = remainder === 0 ? 0 : cols - remainder
    const getIcon = (wfId: any) => {
        if (!wfIcons) {
            return null;
        }
        if (!wfId) {
            return null;
        }
        return wfIcons[wfId]
    }
    return (
        <div className="grid grid-cols-4 gap-y-5 gap-x-2">
            {items.map((item) => (
                <AppIcon key={item.id} name={item.name} item={item} icon={getIcon(item.id)}/>
            ))}
            {Array.from({length: padding}).map((_, i) => (
                <div key={`pad-${i}`} className="w-full"/>
            ))}
        </div>
    )
}

export default function OAWorkbench({data = [], wfIcons = {}}: { data?: Category[], wfIcons?: object }) {
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

    return (
        <div className="min-h-screen bg-[#f0f6fb]">
            <div className="h-10"/>

            {/* 搜索栏 */}
            <div className="px-4 pb-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a9fd8]"/>
                    <Input
                        placeholder="搜索"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full h-9 pl-9 pr-4 bg-white rounded-xl border border-[#daeef8] text-sm placeholder:text-gray-400 text-gray-700 focus-visible:ring-1 focus-visible:ring-[#1a9fd8]/50"
                    />
                </div>
            </div>

            {/* 各分类区块 */}
            {filteredData.length === 0 && (
                <div className="mx-4 mt-8 flex flex-col items-center text-gray-400 text-sm gap-2">
                    <Search className="w-10 h-10 opacity-30"/>
                    <span>未找到相关功能</span>
                </div>
            )}
            {filteredData.map((category) => (
                <div
                    key={category.id}
                    className="mx-4 mb-4 rounded-2xl p-4 bg-white border border-[#daeef8] shadow-sm"
                >
                    <div className="flex items-center gap-2 mb-4">
            <span
                className="w-1 h-4 rounded-full inline-block"
                style={{backgroundColor: category.color}}
            />
                        <h2 className="text-base font-semibold text-gray-800 wf-group-title">{category.typeName}</h2>
                    </div>
                    <AppGrid items={category.wfbeans} wfIcons={wfIcons} color={category.color}/>
                </div>
            ))}

            <div className="h-8"/>
        </div>
    )
}
