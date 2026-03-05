import PCWorkbench from "../components/pc-workbench"

const rawData = [
  {
    id: "64",
    color: "#55D2D4",
    typeName: "湖南航天收文",
    wfbeans: [
      { id: "354", name: "收文办理", spell: "SWBL" },
      { id: "355", name: "收文办理（副本）", spell: "SWBLFB" },
    ],
  },
  {
    id: "13",
    color: "#B37BFA",
    typeName: "土地收购维护",
    wfbeans: [
      { id: "30", name: "购置土地和ACQ物业维护申请表", spell: "GZTDHWYWHSQB" },
    ],
  },
  {
    id: "2",
    color: "#8DCE36",
    typeName: "事项申请",
    wfbeans: [
      { id: "6", name: "会议申请", spell: "HYSQ" },
      { id: "3", name: "出差外出", spell: "CCWC" },
      { id: "2", name: "考勤异常", spell: "KQYC" },
      { id: "5", name: "证明开具申请", spell: "ZMKJSQ" },
      { id: "161", name: "加班申请", spell: "JBSQ" },
      { id: "163", name: "请假申请", spell: "QJSQ" },
      { id: "200", name: "VPN账户申请", spell: "VPNZHSQ" },
      { id: "201", name: "外出审批", spell: "WCSQ" },
    ],
  },
  {
    id: "3",
    color: "#FF7A4D",
    typeName: "行政管理类",
    wfbeans: [
      { id: "10", name: "车辆行驶记录单", spell: "CLXSJLD" },
      { id: "11", name: "固定资产领用申请", spell: "GDZCLYASQ" },
      { id: "12", name: "固定资产归还申请", spell: "GDZCGHSQ" },
      { id: "13", name: "办公用品申领", spell: "BGYPSL" },
    ],
  },
  {
    id: "4",
    color: "#FFC62E",
    typeName: "财务管理类",
    wfbeans: [
      { id: "20", name: "费用报销申请", spell: "FYBBXSQ" },
      { id: "21", name: "借款申请", spell: "JKSQ" },
      { id: "22", name: "请购申请", spell: "QGSQ" },
      { id: "23", name: "采购申请", spell: "CGSQ" },
    ],
  },
  {
    id: "5",
    color: "#4A90E2",
    typeName: "人力资源类",
    wfbeans: [
      { id: "40", name: "转正申请表", spell: "ZZSQB" },
      { id: "41", name: "离职申请单", spell: "LZSQD" },
      { id: "42", name: "离职交接", spell: "LZJJ" },
      { id: "43", name: "入职办理", spell: "RZBL" },
      { id: "44", name: "基层岗位评价考核", spell: "JCGWPJKH" },
      { id: "45", name: "劳动合同签订", spell: "LDHTQD" },
      { id: "46", name: "外派申请", spell: "WPSQ" },
      { id: "47", name: "云课堂", spell: "YKT" },
    ],
  },
  {
    id: "6",
    color: "#E94D4D",
    typeName: "合同管理类",
    wfbeans: [
      { id: "50", name: "合同会签", spell: "HTHQ" },
      { id: "51", name: "合同变更", spell: "HTBG" },
      { id: "52", name: "合同终止", spell: "HTZZ" },
      { id: "53", name: "合同归档", spell: "HTGD" },
    ],
  },
  {
    id: "7",
    color: "#36C78D",
    typeName: "项目管理类",
    wfbeans: [
      { id: "60", name: "项目立项申请", spell: "XMLXSQ" },
      { id: "61", name: "项目变更申请", spell: "XMBGSQ" },
      { id: "62", name: "项目结项申请", spell: "XMJXSQ" },
      { id: "63", name: "公司资质申请", spell: "GSZZSQ" },
    ],
  },
  {
    id: "99",
    color: "#FFC62E",
    typeName: "系统默认工作流",
    wfbeans: [
      { id: "99", name: "E8-E9数据迁移测试流程", spell: "E8E9SJQYCSLC" },
    ],
  },
]

export default function PCPage() {
  return <PCWorkbench data={rawData} />
}
