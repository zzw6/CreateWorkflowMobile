"use client"

import OAWorkbench from "./components/oa-workbench"
import {useEffect, useState} from "react";
import axios from "axios";

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

const colors = [
    "#55D2D4", "#B37BFA", "#8DCE36", "#FF7A4D",
    "#FFC62E", "#4A90E2", "#E94D4D", "#36C78D"
]

export default function Page() {
    const [rawData, setRawData] = useState<Category[]>([])
    const [wfIcons, setWfIcons] = useState({})
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return
        axios.get('/api/workflow/list/newflow/getNewFlowListData').then(response => {
            const listData = response.data.data?.listData || []
            const listDataGroup = response.data.data?.listDataGroup || []

            // 将 listData 按 type 分组
            const groupedData = listDataGroup.map((group: any, index: number) => {
                const workflows = listData.filter((item: any) => item.type === group.id)
                return {
                    id: group.id,
                    typeName: group.typename,
                    color: colors[index % colors.length],
                    wfbeans: workflows.map((wf: any) => ({
                        id: wf.workflowid,
                        name: wf.workflowname,
                        spell: wf.letter || ''
                    }))
                }
            }).filter((cat: Category) => cat.wfbeans.length > 0)

            setRawData(groupedData)
        }).catch(err => {
            console.error('获取工作流信息失败:', err)
        })
        axios.get('/api/secondev/icon/list').then(response => {
            const iconList = response.data.data || []
            // 将数组转换为以 lcbs 为 key 的对象
            const iconMap = iconList.reduce((acc: any, item: any) => {
                if (item.lcbs && item.dytb_url) {
                    acc[item.lcbs] = item.dytb_url
                }
                return acc
            }, {})
            setWfIcons(iconMap)
        }).catch(err => {
            console.error('获取图标失败:', err)
        })
    }, [mounted])

    if (!mounted) {
        return <div className="min-h-screen bg-[#f0f6fb]"></div>
    }

    return <OAWorkbench data={rawData} wfIcons={wfIcons}/>
}
