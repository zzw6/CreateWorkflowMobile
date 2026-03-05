// iOS 风格图标：浅蓝圆角背景 + 蓝色图标居中，纯平风格

import type { LucideIcon } from "lucide-react"

const BLUE = "#1a9fd8"
const BG = "#daeef8"

interface DualColorIconProps {
  Icon: LucideIcon
  size?: "lg" | "md" | "sm"
  badge?: string // 保留参数兼容旧调用
}

export default function DualColorIcon({ Icon, size = "lg" }: DualColorIconProps) {
  const configs = {
    lg: { box: 56, radius: 18, iconSize: 28 },
    md: { box: 40, radius: 13, iconSize: 20 },
    sm: { box: 32, radius: 10, iconSize: 16 },
  }
  const { box, radius, iconSize } = configs[size]

  return (
    <div
      style={{
        width: box,
        height: box,
        borderRadius: radius,
        backgroundColor: BG,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon style={{ width: iconSize, height: iconSize, color: BLUE, display: "block" }} strokeWidth={1.8} />
    </div>
  )
}
