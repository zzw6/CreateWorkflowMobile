export interface WfBean {
  id: string
  name: string
  spell: string
}

export interface Category {
  id: string
  typeName: string
  color: string
  wfbeans: WfBean[]
}

export const MOCK_COLORS = [
  "#2B3CC8", "#7C3AED", "#0891B2", "#059669",
  "#D97706", "#DC2626", "#0284C7", "#4F63E7"
]

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "1",
    typeName: "人事管理",
    color: "#2B3CC8",
    wfbeans: [
      { id: "101", name: "入职申请", spell: "rzSQ" },
      { id: "102", name: "转正申请", spell: "zzSQ" },
      { id: "103", name: "离职申请", spell: "lzSQ" },
      { id: "104", name: "员工调岗", spell: "ygDG" },
      { id: "105", name: "招聘需求", spell: "zpXQ" },
      { id: "106", name: "人员外派", spell: "ryWP" },
      { id: "107", name: "合同签订", spell: "htQD" },
    ]
  },
  {
    id: "2",
    typeName: "行政审批",
    color: "#7C3AED",
    wfbeans: [
      { id: "201", name: "请假申请", spell: "qjSQ" },
      { id: "202", name: "加班申请", spell: "jbSQ" },
      { id: "203", name: "外出申请", spell: "wcSQ" },
      { id: "204", name: "出差申请", spell: "ccSQ" },
      { id: "205", name: "用车申请", spell: "ycSQ" },
      { id: "206", name: "印章使用", spell: "yzSY" },
    ]
  },
  {
    id: "3",
    typeName: "财务报销",
    color: "#0891B2",
    wfbeans: [
      { id: "301", name: "费用报销", spell: "fyBX" },
      { id: "302", name: "差旅报销", spell: "clBX" },
      { id: "303", name: "借款申请", spell: "jkSQ" },
      { id: "304", name: "付款申请", spell: "fkSQ" },
      { id: "305", name: "采购请购", spell: "cqQG" },
    ]
  },
  {
    id: "4",
    typeName: "IT运维",
    color: "#059669",
    wfbeans: [
      { id: "401", name: "账户申请", spell: "zhSQ" },
      { id: "402", name: "VPN申请", spell: "vpnSQ" },
      { id: "403", name: "设备申请", spell: "sbSQ" },
      { id: "404", name: "系统权限", spell: "xtQX" },
      { id: "405", name: "安全审批", spell: "aqSP" },
    ]
  },
  {
    id: "5",
    typeName: "培训发展",
    color: "#D97706",
    wfbeans: [
      { id: "501", name: "培训申请", spell: "pxSQ" },
      { id: "502", name: "云课堂报名", spell: "yktBM" },
      { id: "503", name: "考核评价", spell: "khPJ" },
      { id: "504", name: "技能认证", spell: "jnRZ" },
    ]
  },
  {
    id: "6",
    typeName: "合规法务",
    color: "#DC2626",
    wfbeans: [
      { id: "601", name: "合同审批", spell: "htSP" },
      { id: "602", name: "资质申报", spell: "zzSB" },
      { id: "603", name: "合规审查", spell: "hgSC" },
    ]
  }
]

export const MOCK_USER = {
  name: "张伟",
  department: "技术研发部",
  avatar: "张",
  todoCount: 12,
  doneCount: 38,
  ccCount: 5,
}

export const MOCK_NOTICES = [
  "关于2025年春节放假安排的通知",
  "关于加强信息安全管理的通知",
  "关于Q4绩效考核工作安排",
]
